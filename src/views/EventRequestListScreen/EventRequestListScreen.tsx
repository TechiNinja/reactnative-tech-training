import React from 'react';
import { FlatList, Text, View } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper/ScreenWrapper';
import { styles } from './EventRequestListScreenStyles';
import EventRequestStatusTabs from '../../components/EventRequestStatusTab/EventRequestStatusTab';
import AppButton from '../../components/AppButton/AppButton';
import { APP_STRINGS } from '../../constants/AppStrings';
import { useEventRequestListViewModel } from '../../viewModels/EventRequestListScreenViewModel';
import EventRequestCard from '../../components/EventRequestCard/EventRequestCard';
import { UserRoleType } from '../../models/User';

type EventRequestListScreenProps = {
  role: UserRoleType;
};

const EventRequestListScreen = ({ role }: EventRequestListScreenProps) => {
  const viewModel = useEventRequestListViewModel(role);

  return (
    <ScreenWrapper scrollable={false}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={role === 'participant' ? styles.headingParticipant : styles.heading}>
            Requests
          </Text>
          {role === 'admin' && (
            <AppButton
              title={APP_STRINGS.RequestScreen.raiseRequest}
              onPress={viewModel.onRaiseRequest}
            />
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