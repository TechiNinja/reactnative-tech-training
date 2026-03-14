import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/AuthStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { AnalyticsService, AdminAnalytics } from '../services/analyticsService';

export const useAdminHomeViewModel = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { logout } = useAuthStore();
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AnalyticsService.getAdminAnalytics()
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

  const onAddEvent = () => {
    navigation.navigate('EventForm', { mode: 'create' });
  };

  const onAddUser = () => {
    navigation.navigate('UserForm', { mode: 'create' });
  };

  const onRaiseRequest = () => {
    navigation.navigate('EventRequestForm', { mode: 'create' });
  };

  const onGetNotificaton = () => {
    navigation.navigate('Notification', { audience: 'Admin' });
  };

  return {
    onLogoutPress,
    onAddEvent,
    onAddUser,
    onRaiseRequest,
    analytics,
    loading,
    onGetNotificaton
  };
};