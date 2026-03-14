import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { EventStatusTab } from '../models/Event';
import { UserRoleType } from '../models/User';
import { EventResponse } from '../models/EventResponse';
import { authFetch } from '../utils/authFetch';

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

  const filteredEvents = useMemo(() => {
    if (activeTab === EventStatusTab.ALL) return events;
    return events.filter((e) => e.status === activeTab);
  }, [events, activeTab]);

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