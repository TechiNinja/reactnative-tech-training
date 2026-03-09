import { useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Event, EventStatusTab } from '../models/Event';
import { useEventStore } from '../store/EventStore';
import { UserRoleType } from '../models/User';

export const useEventsListViewModel = (role: UserRoleType) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { events } = useEventStore();

  const [activeTab, setActiveTab] = useState<EventStatusTab>(
    EventStatusTab.ALL,
  );

  const tabBarHeight = useBottomTabBarHeight();

  const filteredEvents = useMemo(() => {
    if (activeTab === EventStatusTab.ALL) return events;
    return events.filter(
      (event) => event.status === (activeTab as unknown as Event['status']),
    );
  }, [activeTab, events]);

  const onEventPress = (event: Event) => {
    navigation.navigate('EventDetails', {
      eventId: event.id,
      role,
    });
  };

  const onCreateEvent = () => {
    navigation.navigate('EventForm', { mode: 'create' });
  };

  return {
    activeTab,
    setActiveTab,
    filteredEvents,
    tabBarHeight,
    onEventPress,
    onCreateEvent,
  };
};
