import { useEffect, useMemo, useState } from 'react';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { RoleType } from '../constants/Roles';
import { EventRequestResponse, RequestStatus } from '../models/EventRequest';
import { authFetch } from '../utils/authFetch'; // ✅ replaced local api with authFetch

export const useEventRequestListViewModel = (
  navigation: NativeStackNavigationProp<RootStackParamList>,
  role: RoleType,
) => {
  const [activeTab, setActiveTab] = useState<RequestStatus>(RequestStatus.PENDING);
  const [requests, setRequests] = useState<EventRequestResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const tabBarHeight = useBottomTabBarHeight();

  const fetchRequests = async (status: RequestStatus) => {
    try {
      setLoading(true);
      const data = await authFetch<EventRequestResponse[]>( // ✅ authFetch with token
        `/EventRequests?status=${status}`,
      );
      setRequests(data);
    } catch (e) {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(activeTab);
  }, [activeTab]);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => r.status === activeTab);
  }, [requests, activeTab]);

  const onRequestPress = (request: EventRequestResponse) => {
    navigation.navigate('EventRequestDetails', { request, role });
  };

  const onRaiseRequest = () => {
    navigation.navigate('EventRequestForm', { mode: 'create' });
  };

  const onRefresh = async () => {
    await fetchRequests(activeTab);
  };

  return {
    activeTab,
    setActiveTab,
    filteredRequests,
    tabBarHeight,
    onRequestPress,
    onRaiseRequest,
    loading,
    refreshing,
    onRefresh,
  };
};