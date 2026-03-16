import { useEffect, useState, useCallback } from 'react';
import { getUser } from '../utils/authStorage';
import {
  notificationService,
  NotificationAudience,
  NotificationItem,
} from '../services/notificationService';

export const useNotificationViewModel = (
  navigation: any,
  audience: NotificationAudience = 'Ops',
) => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [error, setError] = useState('');

  const getNotificationFilter = useCallback(async () => {
    if (audience === 'Admin') {
      const user = await getUser();

      return {
        audience,
        userId: user?.id,
      };
    }

    return { audience };
  }, [audience]);

  const notificationFetch = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const filter = await getNotificationFilter();
      const data = await notificationService.getAll(filter);

      const sortedNotifications = [...data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      setNotifications(sortedNotifications);
    } catch (error: any) {
      setError(
        error?.message || 'Something went wrong while fetching notifications.',
      );
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [getNotificationFilter]);

  const markAllAsRead = useCallback(async () => {
    try {
      const filter = await getNotificationFilter();
      await notificationService.markAllAsRead(filter);
    } catch (error) {
      console.log('Failed to mark notifications as read:', error);
    }
  }, [getNotificationFilter]);

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

  const unreadCount = notifications.filter(item => !item.isRead).length;

  return {
    handleBack,
    refresh,
    loading,
    notifications,
    error,
    unreadCount,
  };
};