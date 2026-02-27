import { useMemo, useState } from 'react';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useUserStore } from '../store/UserStore';
import { User, UserRoleType } from '../models/User';
import { RoleNameTabType } from '../components/RoleNameTabs/RoleNameTabs';

const TAB_TO_ROLE: Partial<Record<RoleNameTabType, UserRoleType>> = {
  ADMIN: 'admin',
  'OPS TEAM': 'operations',
  ORGANIZER: 'organizer',
  PARTICIPANTS: 'participant',
};

export const useUsersListViewModel = (
  navigation: NativeStackNavigationProp<RootStackParamList>,
) => {
  const { users, loading, error, refreshUsers } = useUserStore();
  const [activeTab, setActiveTab] = useState<RoleNameTabType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const tabBarHeight = useBottomTabBarHeight();

  const filteredUsers = useMemo(() => {
    let result = users;

    if (activeTab !== 'ALL') {
      const roleFilter = TAB_TO_ROLE[activeTab];
      if (roleFilter) {
        result = result.filter((user) => user.role === roleFilter);
      }
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query),
      );
    }

    return result;
  }, [activeTab, searchQuery, users]);

  const onUserPress = (user: User) => {
    navigation.navigate('UserForm', { mode: 'edit', user });
  };

  const onAddUser = () => {
    navigation.navigate('UserForm', { mode: 'create' });
  };

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    filteredUsers,
    tabBarHeight,
    loading,
    error,
    refreshUsers,
    onUserPress,
    onAddUser,
  };
};
