import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  View,
} from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper/ScreenWrapper';
import UserCard from '../../components/UserCard/UserCard';
import { styles } from './UsersListScreenStyles';
import RoleNameTabs from '../../components/RoleNameTabs/RoleNameTabs';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import AppButton from '../../components/AppButton/AppButton';
import { APP_STRINGS } from '../../constants/AppStrings';
import { useUsersListViewModel } from '../../viewModels/UsersListScreenViewModel';
import { Search } from 'lucide-react-native';
import { colors } from '../../theme/colors';

const UsersListScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const viewModel = useUsersListViewModel(navigation);

  return (
    <ScreenWrapper scrollable={false}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.heading}>{APP_STRINGS.userScreen.allUsers}</Text>
          <AppButton
            title={APP_STRINGS.userScreen.addUser}
            onPress={viewModel.onAddUser}
          />
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder={APP_STRINGS.placeHolders.searchUsers}
            placeholderTextColor={colors.textSecondary}
            value={viewModel.searchQuery}
            onChangeText={viewModel.setSearchQuery}
          />
        </View>

        <RoleNameTabs
          activeTab={viewModel.activeTab}
          onChange={viewModel.setActiveTab}
        />

        {viewModel.loading && !viewModel.filteredUsers.length ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : viewModel.error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{viewModel.error}</Text>
            <AppButton
              title={APP_STRINGS.buttons.retry}
              onPress={viewModel.refreshUsers}
            />
          </View>
        ) : viewModel.filteredUsers.length === 0 ? (
          <Text style={styles.noUsersStyle}>
            {APP_STRINGS.userScreen.noUsersFound}
          </Text>
        ) : (
          <FlatList
            data={viewModel.filteredUsers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <UserCard
                user={item}
                onPress={() => viewModel.onUserPress(item)}
              />
            )}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={viewModel.loading}
                onRefresh={viewModel.refreshUsers}
                tintColor={colors.primary}
              />
            }
            contentContainerStyle={{
              paddingBottom: viewModel.tabBarHeight + 65,
            }}
          />
        )}
      </View>
    </ScreenWrapper>
  );
};

export default UsersListScreen;
