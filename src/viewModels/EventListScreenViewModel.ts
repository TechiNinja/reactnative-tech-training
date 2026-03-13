import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { EventStatusTab } from '../models/Event';
import { RoleType } from '../constants/Roles';
import { authFetch } from '../utils/authFetch';
import { EventResponse } from '../models/EventResponse';

export const useEventsListViewModel = (
  navigation: NativeStackNavigationProp<RootStackParamList>,
  role: RoleType,
) => {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<EventStatusTab>(EventStatusTab.ALL);
  const tabBarHeight = useBottomTabBarHeight();

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const status = activeTab === EventStatusTab.ALL ? undefined : activeTab;
      const url = status ? `/events?status=${status}` : '/events';
      const data = await authFetch<EventResponse[]>(url);
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

  const filteredEvents = useMemo(() => events, [events]);

  const onEventPress = (event: EventResponse) => {
    navigation.navigate('EventDetails', {
      eventId: String(event.id),
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
    loading,
    tabBarHeight,
    onEventPress,
    onCreateEvent,
  };
};