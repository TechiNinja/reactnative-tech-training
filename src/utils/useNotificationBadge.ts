import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { createNotificationConnection } from '../utils/signalRClient';
import { getToken, getUser } from '../utils/authStorage';
import { API_BASE_URL } from '../config/api';
import * as signalR from "@microsoft/signalr";

export type NotificationAudience = 'Ops' | 'Admin';

export const useNotificationBadge = (audience: NotificationAudience) => {
  const [count, setCount] = useState(0);

  const loadUnreadCount = useCallback(async () => {
    try {
      const token = await getToken();
      const user = await getUser();

      let url = `${API_BASE_URL}/Notifications/unread-count?audience=${audience}`;

      if (audience === 'Admin' && !user?.id) {
        setCount(0);
        return;
      }

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        setCount(0);
        return;
      }

      const text = await res.text();
      const unreadCount = text ? Number(text) : 0;
      setCount(Number.isNaN(unreadCount) ? 0 : unreadCount);
    } catch (err) {
      console.log('Failed to load unread count:', err);
      setCount(0);
    }
  }, [audience]);

  useEffect(() => {
    let conn: signalR.HubConnection | null = null;

    const handleNewNotification = async () => {
      await loadUnreadCount();
    };

    const startConnection = async () => {
      try {
        conn = createNotificationConnection();
        conn.on('notification:new', handleNewNotification);

        await conn.start();

        if (audience === 'Ops') {
          await conn.invoke('JoinOpsGroup');
        } else {
          const user = await getUser();
          const adminId = user?.id;

          if (!adminId) {
            throw new Error('Admin id not found');
          }

          await conn.invoke('JoinAdminGroup', adminId);
        }
      } catch (err) {
        console.log('SignalR start error:', err);
      }
    };

    loadUnreadCount();
    startConnection();

    return () => {
      if (conn) {
        conn.off('notification:new', handleNewNotification);
        conn.stop();
      }
    };
  }, [audience, loadUnreadCount]);

  useFocusEffect(
    useCallback(() => {
      loadUnreadCount();
    }, [loadUnreadCount]),
  );

  return {
    count,
    refreshBadge: loadUnreadCount,
  };
};