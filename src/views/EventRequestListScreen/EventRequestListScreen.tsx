import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Bell } from 'lucide-react-native';

import ScreenWrapper from '../../components/ScreenWrapper/ScreenWrapper';
import EventRequestStatusTabs from '../../components/EventRequestStatusTab/EventRequestStatusTab';
import AppButton from '../../components/AppButton/AppButton';
import EventRequestCard from '../../components/EventRequestCard/EventRequestCard';

import { styles } from './EventRequestListScreenStyles';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { APP_STRINGS } from '../../constants/AppStrings';
import { colors } from '../../theme/colors';
import { useEventRequestListViewModel } from '../../viewModels/EventRequestListScreenViewModel';
import { UserRoleType } from '../../models/User';

type EventRequestListScreenProps = {
  role: UserRoleType;
};

const EventRequestListScreen = ({ role }: EventRequestListScreenProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    activeTab,
    setActiveTab,
    filteredRequests,
    tabBarHeight,
    refreshing,
    onRefresh,
    onRequestPress,
    onRaiseRequest,
    onOpenNotifications,
    notificationCount,
    showNotificationBadge,
  } = useEventRequestListViewModel(navigation, role);

  const headingStyle =
    role === 'participant' ? styles.headingParticipant : styles.heading;

  return (
    <ScreenWrapper scrollable={false}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={headingStyle}>
            {APP_STRINGS.EventRequestScreen.Request}
          </Text>

          {role === 'admin' && (
            <AppButton
              title={APP_STRINGS.RequestScreen.raiseRequest}
              onPress={onRaiseRequest}
            />
          )}

          {role === 'operations' && (
            <Pressable style={styles.button} onPress={onOpenNotifications}>
              <View style={styles.notificationIconContainer}>
                <Bell size={25} color={colors.primary} />

                {showNotificationBadge && (
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          )}
        </View>

        <EventRequestStatusTabs
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {filteredRequests.length === 0 ? (
          <Text style={styles.noEventStyle}>
            {APP_STRINGS.RequestScreen.noRequestFound}
          </Text>
        ) : (
          <FlatList
            data={filteredRequests}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => (
              <EventRequestCard
                request={item}
                role={role}
                onPress={() => onRequestPress(item)}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.listContentContainer,
              { paddingBottom: tabBarHeight },
            ]}
            onRefresh={onRefresh}
            refreshing={refreshing}
          />
        )}
      </View>
    </ScreenWrapper>
  );
};

export default EventRequestListScreen;