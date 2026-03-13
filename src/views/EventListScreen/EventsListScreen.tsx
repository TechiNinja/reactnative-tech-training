import React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { RoleType } from '../../constants/Roles';
import ScreenWrapper from '../../components/ScreenWrapper/ScreenWrapper';
import EventCard from '../../components/EventCard/EventCard';
import { styles } from './EventsListScreenStyles';
import EventStatusTabs from '../../components/EventStatusTabs/EventStatusTabs';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import AppButton from '../../components/AppButton/AppButton';
import { APP_STRINGS } from '../../constants/AppStrings';
import { useEventsListViewModel } from '../../viewModels/EventListScreenViewModel';
import { colors } from '../../theme/colors';
import { EventResponse } from '../../models/EventResponse';

type EventListScreenProps = {
  role: RoleType;
};

const EventsListScreen = ({ role }: EventListScreenProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const viewModel = useEventsListViewModel(navigation, role);

  return (
    <ScreenWrapper scrollable={false}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text
            style={
              role === 'participant' ? styles.headingParticipant : styles.heading
            }
          >
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
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: 40 }}
          />
        ) : viewModel.filteredEvents.length === 0 ? (
          <Text style={styles.noEventStyle}>
            {APP_STRINGS.eventScreen.noEventFound}
          </Text>
        ) : (
          <FlatList
            data={viewModel.filteredEvents}
            keyExtractor={(item: EventResponse) => String(item.id)}
            renderItem={({ item }: { item: EventResponse }) => (
              <EventCard
                event={item}
                role={role}
                onPress={() => viewModel.onEventPress(item)}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: viewModel.tabBarHeight + 65,
            }}
          />
        )}
      </View>
    </ScreenWrapper>
  );
};

export default EventsListScreen;