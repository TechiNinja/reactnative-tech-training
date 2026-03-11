import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert } from 'react-native';
import { useState } from 'react';
import { RootStackParamList } from '../navigation/AppNavigator';
import { EventRequestResponse, RequestStatus } from '../models/EventRequest';
import { eventRequestService } from '../services/eventRequestService';

type RouteType = {
  key: string;
  name: 'EventRequestDetails';
  params: RootStackParamList['EventRequestDetails'];
};

type OpsStatus = 'Approved' | 'Rejected';

export const useEventRequestDetailsViewModel = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteType>();

  const request: EventRequestResponse | undefined = route.params?.request;

  const canUpdate = request?.status === RequestStatus.PENDING;
  const canCreateEvent = request?.status === RequestStatus.APPROVED;
  const canApproved = request?.status === RequestStatus.PENDING;
  const canRejected = request?.status === RequestStatus.PENDING;
  const canWithdraw = request?.status === RequestStatus.PENDING;

  const [approvingOrRejecting, setApprovingOrRejecting] = useState(false);

  const handleBack = () => navigation.goBack();

  const decideOps = async (opsStatus: OpsStatus, remarks: string) => {
    if (!request) return;

    const trimmed = remarks.trim();
    if (!trimmed) {
      Alert.alert('Error', 'Remarks are required');
      return;
    }

    try {
      setApprovingOrRejecting(true);
      await eventRequestService.decide(request.id, opsStatus, { remarks: trimmed });
      Alert.alert('Success', `Request ${opsStatus} successfully`);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Something went wrong');
    } finally {
      setApprovingOrRejecting(false);
    }
  };

  const handleApproved = (remarks: string) => {
    if (!request || !canApproved) return;
    decideOps('Approved', remarks);
  };

  const handleRejected = (remarks: string) => {
    if (!request || !canRejected) return;
    decideOps('Rejected', remarks);
  };

  const handleUpdate = () => {
    if (!request || !canUpdate) return;

    navigation.navigate('EventRequestForm', {
      mode: 'edit',
      request,
    });
  };

  const handleCreateEvent = () => {
    if (!request || !canCreateEvent) return;
    navigation.navigate('EventForm', { mode: 'create' });
  };

  const handleWithdraw = async () => {
    if (!request || !canWithdraw) return;

    try {
      setApprovingOrRejecting(true);
      await eventRequestService.withdraw(request.id);
      Alert.alert('Success', 'Request withdrawn successfully');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Something went wrong');
    } finally {
      setApprovingOrRejecting(false);
    }
  };

  return {
    request,
    canApproved,
    canRejected,
    handleBack,
    handleApproved,
    handleRejected,
    handleCreateEvent,
    handleUpdate,
    canUpdate,
    canCreateEvent,
    approvingOrRejecting,
    handleWithdraw,
    canWithdraw,
  };
};