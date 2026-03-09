import { useAuthStore } from '../store/AuthStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

export const useAdminHomeViewModel = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { logout } = useAuthStore();

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

  const analytics = {
    totalEvents: 24,
    activeUsers: 156,
    teams: 48,
    matchesToday: 8,
  };

  return {
    onLogoutPress,
    onAddEvent,
    onAddUser,
    analytics,
  };
};
