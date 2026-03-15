import { useEffect, useMemo, useState } from 'react';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/AppNavigator';
import { RequestStatus, EventRequestResponse } from '../models/EventRequest';
import { useEventRequestStore } from '../store/EventRequestStore';
import { UserRoleType } from '../models/User';
import { useNotificationBadge } from '../utils/useNotificationBadge';

export const useEventRequestListViewModel = (
  navigation: NativeStackNavigationProp<RootStackParamList>,
  role: UserRoleType,
) => {
  const [activeTab, setActiveTab] = useState<RequestStatus>(
    RequestStatus.PENDING,
  );
  const [refreshing, setRefreshing] = useState(false);

  const { requests, fetchRequests } = useEventRequestStore();
  const { count: notificationCount } = useNotificationBadge('Ops');

  const tabBarHeight = useBottomTabBarHeight();

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const filteredRequests = useMemo(
    () => requests.filter(request => request.status === activeTab),
    [requests, activeTab],
  );

  const onRequestPress = (request: EventRequestResponse) => {
    navigation.navigate('EventRequestDetails', { request, role });
  };

  const onRaiseRequest = () => {
    navigation.navigate('EventRequestForm', { mode: 'create' });
  };

  const onOpenNotifications = () => {
    navigation.navigate('Notification', { audience: 'Ops' });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchRequests();
    } finally {
      setRefreshing(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    filteredRequests,
    tabBarHeight,
    refreshing,
    notificationCount,
    showNotificationBadge: notificationCount > 0,
    onRefresh,
    onRequestPress,
    onRaiseRequest,
    onOpenNotifications,
  };
};