import { useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { RequestStatus, EventRequestResponse } from '../models/EventRequest';
import { useEventRequestStore } from '../store/EventRequestStore';
import { UserRoleType } from '../models/User';

export const useEventRequestListViewModel = (role: UserRoleType) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const tabBarHeight = useBottomTabBarHeight();

  const [activeTab, setActiveTab] = useState<RequestStatus>(RequestStatus.PENDING);
  const { requests, loading, fetchRequests } = useEventRequestStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => request.status === activeTab);
  }, [requests, activeTab]);

  const onRequestPress = (request: EventRequestResponse) => {
    navigation.navigate('EventRequestDetails', { request, role });
  };

  const onRaiseRequest = () => {
    navigation.navigate('EventRequestForm', { mode: 'create' });
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchRequests();
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
    loading,
    refreshing,
    onRefresh,
    onRequestPress,
    onRaiseRequest,
    notification,
  };
};