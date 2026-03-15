import { useEffect, useState } from 'react';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { RoleType } from '../constants/Roles';
import { EventRequestResponse, RequestStatus } from '../models/EventRequest';
import Config from 'react-native-config';
import { Alert } from 'react-native';

const BASE_URL = Config.BASE_URL;

async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `HTTP ${res.status}`);
  }

  return res.json();
}

export const useEventRequestListViewModel = (
  navigation: NativeStackNavigationProp<RootStackParamList>,
  role: RoleType,
) => {
  const [activeTab, setActiveTab] = useState<RequestStatus>(
    RequestStatus.PENDING,
  );
  const [requests, setRequests] = useState<EventRequestResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const tabBarHeight = useBottomTabBarHeight();

  const fetchRequests = async (status: RequestStatus) => {
    try {
      setLoading(true);
      const data = await api<EventRequestResponse[]>(
        `/EventRequests?status=${status}`,
      );
      setRequests(data);
    } catch (error){
      if(error instanceof Error){
        Alert.alert('Error', error.message);
      }
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(activeTab);
  }, [activeTab]);

  const onRequestPress = (request: EventRequestResponse) => {
    navigation.navigate('EventRequestDetails', { request, role });
  };

  const onRaiseRequest = () => {
    navigation.navigate('EventRequestForm', { mode: 'create' });
  };

  const getContentContainerStyle = () => ({
    paddingBottom: tabBarHeight,
  });

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchRequests(activeTab);
    } finally {
      setRefreshing(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    requests,
    getContentContainerStyle,
    onRequestPress,
    onRaiseRequest,
    loading,
    refreshing,
    onRefresh,
  };
};
