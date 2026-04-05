import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { EventStatusTab } from '../models/Event';
import { UserRoleType } from '../models/User';
import { EventResponse } from '../models/EventResponse';
import { getAllEvents } from '../services/eventService';

export const useEventsListViewModel = (role: UserRoleType) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const tabBarHeight = useBottomTabBarHeight();
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<EventStatusTab>(EventStatusTab.ALL);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const status = activeTab === EventStatusTab.ALL ? undefined : activeTab;
      const data = await getAllEvents(status ? { status } : undefined);
      setEvents(data ?? []);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const filteredEvents = useMemo(() => {
    if (activeTab === EventStatusTab.ALL) return events;
    return events.filter((e) => e.status.toUpperCase() === activeTab);
  }, [events, activeTab]);

  const listContentStyle = useMemo(
    () => ({ paddingBottom: tabBarHeight + 65 }),
    [tabBarHeight],
  );

  const onEventPress = (event: EventResponse) => {
    navigation.navigate('EventDetails', {
      eventId: String(event.id),
      role,
    });
  };

  return {
    activeTab,
    setActiveTab,
    filteredEvents,
    loading,
    listContentStyle,
    onEventPress,
  };
};