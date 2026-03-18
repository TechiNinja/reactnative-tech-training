import React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper/ScreenWrapper';
import EventCard from '../../components/EventCard/EventCard';
import { styles } from './EventsListScreenStyles';
import EventStatusTabs from '../../components/EventStatusTabs/EventStatusTabs';
import AppButton from '../../components/AppButton/AppButton';
import { APP_STRINGS } from '../../constants/appStrings';
import { useEventsListViewModel } from '../../viewModels/EventListScreenViewModel';
import { colors } from '../../theme/colors';
import { EventResponse } from '../../models/EventResponse';
import { UserRoleType } from '../../models/User';

type EventListScreenProps = {
  role: UserRoleType;
};

const EventsListScreen = ({ role }: EventListScreenProps) => {
  const viewModel = useEventsListViewModel(role);

  return (
    <ScreenWrapper scrollable={false}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={role === 'participant' ? styles.headingParticipant : styles.heading}>
            {APP_STRINGS.eventScreen.allEvents}
          </Text>
          {(role === 'admin' || role === 'organizer') && (
            <AppButton
              title={APP_STRINGS.eventScreen.createEvent}
              onPress={viewModel.onCreateEvent}
            />
          )}
        </View>

        <EventStatusTabs
          activeTab={viewModel.activeTab}
          onChange={viewModel.setActiveTab}
        />

        {viewModel.loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : viewModel.filteredEvents.length === 0 ? (
          <Text style={styles.noEventStyle}>{APP_STRINGS.eventScreen.noEventFound}</Text>
        ) : (
          <FlatList
            data={viewModel.filteredEvents}
            keyExtractor={(item: EventResponse) => String(item.id)}
            renderItem={({ item }: { item: EventResponse }) => (
              <EventCard event={item} role={role} onPress={() => viewModel.onEventPress(item)} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={viewModel.listContentStyle}
          />
        )}
      </View>
    </ScreenWrapper>
  );
};

export default EventsListScreen;