import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { createNotificationConnection } from '../utils/signalRClient';
import { getUser } from '../utils/authStorage';
import * as signalR from '@microsoft/signalr';
import { Alert } from 'react-native';
import { notificationService } from '../services/notificationService';

export type NotificationAudience = 'Ops' | 'Admin';

export const useNotificationBadge = (audience: NotificationAudience) => {
  const [count, setCount] = useState(0);

  const loadUnreadCount = useCallback(async () => {
    try {
      const unreadCount = await notificationService.getUnreadCount(audience);
      setCount(Number.isNaN(Number(unreadCount)) ? 0 : Number(unreadCount));
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert(err.message);
      }
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
        if (err instanceof Error) {
          Alert.alert(err.message);
        }
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