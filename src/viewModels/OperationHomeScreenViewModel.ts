import { useCallback, useEffect, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuthStore } from '../store/AuthStore';
import { useNotificationBadge } from '../utils/useNotificationBadge';
import { AnalyticsService, OperationAnalytics} from '../services/analyticsService';


export const useOperationHomeViewModel = (
  navigation: NativeStackNavigationProp<RootStackParamList>,
) => {
  const { logout } = useAuthStore();
  const { count } = useNotificationBadge('Ops');

  const [analytics, setAnalytics] = useState<OperationAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AnalyticsService.getOperationAnalytics()
      .then(setAnalytics)
      .finally(() => setLoading(false));
  }, []);
  
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
    navigation.navigate('Notification', { audience: 'Ops' });
  };

  return {
    loading,
    analytics,
    notificationCount: count,
    onLogoutPress,
    onOpenRequests,
    onOpenNotifications,
  };
};