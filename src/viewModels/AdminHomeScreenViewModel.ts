import { useAuthStore } from '../store/AuthStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

export const useAdminHomeViewModel = (
  navigation: NativeStackNavigationProp<RootStackParamList>,
) => {
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

  const onRaiseRequest = () => {
    navigation.navigate('EventRequestForm', { mode: 'create' });
  };

  return {
    onLogoutPress,
    onAddEvent,
    onAddUser,
    onRaiseRequest,
  };
};