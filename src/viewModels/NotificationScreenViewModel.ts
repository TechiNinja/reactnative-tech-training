import { useEffect, useState, useCallback } from 'react';
import {
  notificationService,
  NotificationAudience,
  NotificationItem,
} from '../services/notificationService';
import { Alert } from 'react-native';
import { validationMessages } from '../constants/validationMessages';

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

      const data = await notificationService.getAll({ audience });

      setNotifications(data);
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
      if (error instanceof Error) {
        const isEmptyJsonError =
          error.message.includes(validationMessages.UNEXPECTED_ERROR) ||
          error.message.includes(validationMessages.JSON_PARSE_ERROR);

        if (isEmptyJsonError) {
          return;
        }
        Alert.alert(validationMessages.ERROR, error.message);
      }
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

  return {
    handleBack,
    refresh,
    loading,
    notifications,
    error,
  };
};