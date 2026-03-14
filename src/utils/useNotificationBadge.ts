import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { createNotificationConnection } from "../utils/signalRClient";
import { getToken, getUser } from "../utils/authStorage";
import {
  getOpsLastSeenCount,
  setOpsLastSeenCount,
  getAdminLastSeenCount,
  setAdminLastSeenCount,
} from "../utils/notificationBadgeStorage";
import { API_BASE_URL } from "../config/api";

export type NotificationAudience = "Ops" | "Admin";

type NotificationItem = {
  id: number;
  userId?: number | null;
  audience?: number | string;
  eventRequestId: number;
  message: string;
  type: number | string;
  createdAt: string;
};

function extractArray(payload: any): NotificationItem[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.result)) return payload.result;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  return [];
}

export const useNotificationBadge = (audience: NotificationAudience) => {
  const [count, setCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const getLastSeen = useCallback(async (): Promise<number> => {
    return audience === "Ops"
      ? await getOpsLastSeenCount()
      : await getAdminLastSeenCount();
  }, [audience]);

  const setLastSeen = useCallback(
    async (value: number): Promise<void> => {
      if (audience === "Ops") {
        await setOpsLastSeenCount(value);
      } else {
        await setAdminLastSeenCount(value);
      }
    },
    [audience]
  );

  const loadInitialCount = useCallback(async () => {
    try {
      const token = await getToken();
      const user = await getUser();
      const userId = user?.id;

      const res = await fetch(
        `${API_BASE_URL}/Notifications?audience=${audience}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      const text = await res.text();

      console.log("Notification badge API_BASE_URL =>", API_BASE_URL);
      console.log("Notification badge status =>", res.status);
      console.log("Notification badge text =>", text);

      if (!res.ok) {
        setTotalCount(0);
        setCount(0);
        return;
      }

      let json: any = [];
      try {
        json = text ? JSON.parse(text) : [];
      } catch (error) {
        console.log("Notification JSON parse error:", error);
        json = [];
      }

      const data = extractArray(json);

      const filteredData =
        audience === "Admin"
          ? data.filter((n) => Number(n.userId) === Number(userId))
          : data;

      const currentTotal = filteredData.length;
      const lastSeen = await getLastSeen();
      const unread = Math.max(0, currentTotal - lastSeen);

      setTotalCount(currentTotal);
      setCount(unread);
    } catch (err) {
      console.log("Failed to load notification count:", err);
    }
  }, [audience, getLastSeen]);

  useEffect(() => {
    let isMounted = true;
    let conn: any = null;

    const handleNewNotification = async () => {
      if (!isMounted) return;
      await loadInitialCount();
    };

    const startConnection = async () => {
      try {
        conn = createNotificationConnection();

        conn.on("notification:new", handleNewNotification);

        await conn.start();

        if (audience === "Ops") {
          await conn.invoke("JoinOpsGroup");
        } else {
          const user = await getUser();
          const adminId = user?.id;

          console.log("JoinAdminGroup user =>", user);
          console.log("JoinAdminGroup adminId =>", adminId);

          if (!adminId) {
            throw new Error("Admin id not found");
          }

          await conn.invoke("JoinAdminGroup", adminId);
        }
      } catch (err) {
        console.log("SignalR start error:", err);
      }
    };

    loadInitialCount();
    startConnection();

    return () => {
      isMounted = false;

      if (conn) {
        conn.off("notification:new", handleNewNotification);
        conn.stop();
      }
    };
  }, [audience, loadInitialCount]);

  useFocusEffect(
    useCallback(() => {
      loadInitialCount();
    }, [loadInitialCount])
  );

  const reset = useCallback(async () => {
    try {
      await setLastSeen(totalCount);
      setCount(0);
    } catch (err) {
      console.log("Failed to reset badge count:", err);
    }
  }, [setLastSeen, totalCount]);

  return {
    count,
    totalCount,
    reset,
    refreshBadge: loadInitialCount,
  };
};