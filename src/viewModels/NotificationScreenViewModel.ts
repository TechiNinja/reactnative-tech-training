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

  const notificationFetch = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const data = await notificationService.getAll(audience);

      let filteredNotifications = data;

      if (audience === 'Admin') {
        const user = await getUser();
        filteredNotifications = data.filter(
          item => Number(item.userId) === Number(user?.id),
        );
      }

      const sortedNotifications = [...filteredNotifications].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      console.log(
  'notifications =>',
  sortedNotifications.map(item => ({
    id: item.id,
    message: item.message,
    isRead: item.isRead,
    createdAt: item.createdAt,
  })),
);

console.log(
  'unread from api =>',
  sortedNotifications.filter(item => !item.isRead).length,
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

    

  }, [audience]);

  

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead(audience);
    } catch (error) {
      console.log('Failed to mark notifications as read:', error);
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