import { useAuthStore } from '../store/AuthStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { MOCK_MATCHES, UPCOMING_MATCHES } from '../constants/mockMatches';
import { MOCK_ORGANIZER_ANALYTICS } from '../constants/mockAnalytics';

export const useOrganizerHomeViewModel = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { logout } = useAuthStore();

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

  const analytics = MOCK_ORGANIZER_ANALYTICS;

  return {
    onLogout,
    liveMatches: MOCK_MATCHES,
    upcomingMatches: UPCOMING_MATCHES,
    onCreateEvent,
    analytics,
  };
};
