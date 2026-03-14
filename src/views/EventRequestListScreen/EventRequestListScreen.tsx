import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper/ScreenWrapper';
import { styles } from './EventRequestListScreenStyles';
import EventRequestStatusTabs from '../../components/EventRequestStatusTab/EventRequestStatusTab';
import AppButton from '../../components/AppButton/AppButton';
import { APP_STRINGS } from '../../constants/AppStrings';
import { useEventRequestListViewModel } from '../../viewModels/EventRequestListScreenViewModel';
import EventRequestCard from '../../components/EventRequestCard/EventRequestCard';
import { Bell } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { useNotificationBadge } from '../../utils/useNotificationBadge';
import { UserRoleType } from '../../models/User';

type EventRequestListScreenProps = {
  role: UserRoleType;
};

const EventRequestListScreen = ({ role }: EventRequestListScreenProps) => {
  const viewModel = useEventRequestListViewModel(role);
  const { count, reset } = useNotificationBadge('Ops');

  const handleOpenNotifications = async () => {
    await reset();
    viewModel.notification();
  };

  return (
    <ScreenWrapper scrollable={false}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={role === 'participant' ? styles.headingParticipant : styles.heading}>
            {APP_STRINGS.EventRequestScreen.Request}
          </Text>

          {role === 'admin' && (
            <AppButton
              title={APP_STRINGS.RequestScreen.raiseRequest}
              onPress={viewModel.onRaiseRequest}
            />
          )}

          {role === 'operations' && (
            <Pressable style={styles.button} onPress={handleOpenNotifications}>
              <View style={{ width: 28, height: 28 }}>
                <Bell size={25} color={colors.primary} />
                {count > 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      top: -6,
                      right: -6,
                      minWidth: 18,
                      height: 18,
                      borderRadius: 9,
                      paddingHorizontal: 5,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'red',
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 11, fontWeight: '700' }}>
                      {count > 99 ? '99+' : count}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          )}
        </View>

        <EventRequestStatusTabs
          activeTab={viewModel.activeTab}
          onChange={viewModel.setActiveTab}
        />

        {viewModel.filteredRequests.length === 0 ? (
          <Text style={styles.noEventStyle}>
            {APP_STRINGS.RequestScreen.noRequestFound}
          </Text>
        ) : (
          <FlatList
            data={viewModel.filteredRequests}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <EventRequestCard
                request={item}
                role={role}
                onPress={() => viewModel.onRequestPress(item)}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: viewModel.tabBarHeight }}
            onRefresh={viewModel.onRefresh}
            refreshing={viewModel.refreshing}
          />
        )}
      </View>
    </ScreenWrapper>
  );
};

export default EventRequestListScreen;