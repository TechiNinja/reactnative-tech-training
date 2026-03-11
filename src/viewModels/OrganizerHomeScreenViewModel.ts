import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/AuthStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { MOCK_MATCHES, UPCOMING_MATCHES } from '../constants/mockMatches';
import { AnalyticsService, OrganizerAnalytics } from '../services/analyticsService';

export const useOrganizerHomeViewModel = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { logout } = useAuthStore();
  const [analytics, setAnalytics] = useState<OrganizerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AnalyticsService.getOrganizerAnalytics()
      .then(setAnalytics)
      .finally(() => setLoading(false));
  }, []);

  const onLogout = async () => {
    await logout();

    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth', params: { screen: 'Login' } }],
    });
  };

  const onCreateEvent = () => {
    navigation.navigate('EventForm', { mode: 'create' });
  };

  return {
    onLogout,
    liveMatches: MOCK_MATCHES,
    upcomingMatches: UPCOMING_MATCHES,
    onCreateEvent,
    analytics,
    loading,
  };
};
