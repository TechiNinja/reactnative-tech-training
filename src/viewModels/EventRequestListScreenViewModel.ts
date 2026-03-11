import { useEffect, useMemo, useState } from 'react';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { EventRequestResponse, RequestStatus } from '../models/EventRequest';
import { getUser } from '../utils/authStorage';
import { eventRequestService } from '../services/eventRequestService';
import { UserRoleType } from '../models/User';

export const useEventRequestListViewModel = (
  navigation: NativeStackNavigationProp<RootStackParamList>,
  role: UserRoleType,
) => {
  const [activeTab, setActiveTab] = useState<RequestStatus>(RequestStatus.PENDING);
  const [requests, setRequests] = useState<EventRequestResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const tabBarHeight = useBottomTabBarHeight();

  const fetchAllRequests = async () => {
  try {
    setLoading(true);

    const data = await eventRequestService.search({
      status: activeTab,
    });

    setRequests(data);
  } catch (error) {
    console.log('Fetch requests error =>', error);
    setRequests([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchAllRequests();
  }, [activeTab]);

  const filteredRequests = useMemo(() => requests, [requests]);

  const onRequestPress = (request: EventRequestResponse) => {
    navigation.navigate('EventRequestDetails', { request, role });
  };

  const onRaiseRequest = () => {
    navigation.navigate('EventRequestForm', { mode: 'create' });
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchAllRequests();
    } finally {
      setRefreshing(false);
    }
  };

  const notification = () => {
    navigation.navigate('Notification', { audience: 'Ops' });
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
    notification,
  };
};