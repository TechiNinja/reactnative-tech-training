  import { useEffect, useState, useCallback } from 'react';
  import Config from 'react-native-config';
  import { getToken, getUser } from '../utils/authStorage';
  import {
    setOpsLastSeenCount,
    setAdminLastSeenCount,
  } from '../utils/notificationBadgeStorage';

  const { BASE_URL } = Config;

  export type NotificationAudience = 'Ops' | 'Admin';

  export type NotificationItem = {
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
    if (Array.isArray(payload?.items)) return payload.items;
    if (Array.isArray(payload?.result)) return payload.result;
    if (Array.isArray(payload?.data?.items)) return payload.data.items;
    return [];
  }

  export const useNotificationViewModel = (
    navigation: any,
    audience: NotificationAudience = 'Ops',
  ) => {
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [error, setError] = useState<string>('');

    const handleBack = () => navigation.goBack();

    const notificationFetch = useCallback(async () => {
      try {
        setLoading(true);
        setError('');

        const token = await getToken();

        const base = (BASE_URL ?? '').replace(/\/$/, '');
        const path = `/Notifications?audience=${audience}`;
        const url = `${base}${path}`;

        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const text = await res.text();

        if (res.status === 401) {
          setError('Unauthorized. Please login again.');
          setNotifications([]);
          return;
        }

        if (!res.ok) {
          setError(text || `Request failed (${res.status})`);
          setNotifications([]);
          return;
        }

        const json = text ? JSON.parse(text) : null;
  const data = extractArray(json);

  let filteredData = data;

  if (audience === "Admin") {
    const user = await getUser();
    const userId = user?.id;

    filteredData = data.filter(n => n.userId === userId);
  }

        const sorted = [...filteredData].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        setNotifications(sorted);

        if (audience === 'Ops') {
          await setOpsLastSeenCount(sorted.length);
        } else {
          await setAdminLastSeenCount(sorted.length);
        }
      } catch (e: any) {
        setError(
          e?.message || 'Something went wrong while fetching notifications.',
        );
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    }, [audience]);

    useEffect(() => {
      notificationFetch();
    }, [notificationFetch]);

    const refresh = useCallback(async () => {
      await notificationFetch();
    }, [notificationFetch]);

    return {
      handleBack,
      notificationFetch,
      refresh,
      loading,
      notifications,
      error,
    };
  };