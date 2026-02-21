import { useAuthStore } from '../store/AuthStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { MOCK_MATCHES, UPCOMING_MATCHES } from '../constants/mockMatches';

export const useOrganizerHomeViewModel = (
  navigation: NativeStackNavigationProp<RootStackParamList>,
) => {
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

  return {
    onLogout,
    liveMatches: MOCK_MATCHES,
    upcomingMatches: UPCOMING_MATCHES,
    onCreateEvent,
  };
};
