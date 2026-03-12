import { useCallback, useEffect, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuthStore } from '../store/AuthStore';
import { useNotificationBadge } from '../utils/useNotificationBadge';
import { AnalyticsService } from '../services/AnalyticsService';


export const useOperationHomeViewModel = (
  navigation: NativeStackNavigationProp<RootStackParamList>,
) => {
  const { logout } = useAuthStore();
  const { count, reset } = useNotificationBadge('Ops');
  
  const onLogoutPress = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth', params: { screen: 'Login' } }],
    });
  };

  const onOpenRequests = () => {
    navigation.navigate('OperationTabs', { screen: 'Request' });
  };

  const onOpenNotifications = async () => {
    await reset();
    navigation.navigate('Notification', { audience: 'Ops' });
  };

  return {
    notificationCount: count,
    onLogoutPress,
    onOpenRequests,
    onOpenNotifications,
  };
};