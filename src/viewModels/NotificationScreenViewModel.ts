import { useEffect, useState, useCallback } from 'react';
import { getToken, getUser } from '../utils/authStorage';
import { API_BASE_URL } from '../config/api';

export type NotificationAudience = 'Ops' | 'Admin';

export type NotificationItem = {
  id: number;
  userId?: number | null;
  audience?: number | string;
  eventRequestId: number;
  message: string;
  type: number | string;
  createdAt: string;
  isRead: boolean;
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
  const [error, setError] = useState('');

  const notificationFetch = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const token = await getToken();
      const url = `${API_BASE_URL}/Notifications?audience=${audience}`;

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

      let json: any = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch (e: any) {
        setError(e?.message || 'Invalid notification response.');
        setNotifications([]);
        return;
      }

      const data = extractArray(json);

      let filteredData = data;

      if (audience === 'Admin') {
        const user = await getUser();
        const userId = user?.id;
        filteredData = data.filter(n => Number(n.userId) === Number(userId));
      }

      const sorted = [...filteredData].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      setNotifications(sorted);
    } catch (e: any) {
      setError(
        e?.message || 'Something went wrong while fetching notifications.',
      );
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [audience]);

  const markAllAsRead = useCallback(async () => {
    try {
      const token = await getToken();

      await fetch(`${API_BASE_URL}/Notifications/mark-read?audience=${audience}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch (e) {
      console.log('Failed to mark notifications as read:', e);
    }
  }, [audience]);

  useEffect(() => {
    notificationFetch();
  }, [notificationFetch]);

  const refresh = useCallback(async () => {
    await notificationFetch();
  }, [notificationFetch]);

  const handleBack = useCallback(async () => {
    await markAllAsRead();
    navigation.goBack();
  }, [markAllAsRead, navigation]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return {
    handleBack,
    refresh,
    loading,
    notifications,
    error,
    unreadCount,
  };
};