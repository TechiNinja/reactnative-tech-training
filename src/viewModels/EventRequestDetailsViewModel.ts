import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { authFetch } from '../utils/authFetch';
import { RootStackParamList } from '../navigation/AppNavigator';
import { EventRequestResponse, RequestStatus } from '../models/EventRequest';
import { useEventRequestStore } from '../store/EventRequestStore';
import { validationMessages } from '../constants/validationMessages';

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
  const { withdrawRequest, decideRequest } = useEventRequestStore();
  const [approvingOrRejecting, setApprovingOrRejecting] = useState(false);
  const [isEventAlreadyCreated, setIsEventAlreadyCreated] = useState(false);

  const isPending = request?.status === RequestStatus.PENDING;
  const isApproved = request?.status === RequestStatus.APPROVED;

  const canUpdate = isPending;
  const canApprove = isPending;
  const canReject = isPending;
  const canWithdraw = isPending;
  const canCreateEvent = isApproved && !isEventAlreadyCreated;

  const handleBack = () => navigation.goBack();

  useEffect(() => {
    if (!request || request.status !== RequestStatus.APPROVED) return;

    authFetch<{ isEventAlreadyCreated: boolean }>(`/events/request/${request.id}`)
      .then((data) => setIsEventAlreadyCreated(data?.isEventAlreadyCreated ?? false))
      .catch(() => setIsEventAlreadyCreated(false));
  }, [request?.id]);

  const handleDecision = async (status: OpsStatus, remarks: string) => {
    if (!request || !isPending) return;
    const trimmedRemarks = remarks.trim();
    if (!trimmedRemarks) {
      Alert.alert(validationMessages.remarkRequired);
      return;
    }
    try {
      setApprovingOrRejecting(true);
      await decideRequest(request.id, status, { remarks: trimmedRemarks });
      Alert.alert('Success', `Request ${status} successfully`);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error?.message || validationMessages.SOMETHING_WRONG);
    } finally {
      setApprovingOrRejecting(false);
    }
  };

  const handleApproved = (remarks: string) => {
    if (!canApprove) return;
    handleDecision('Approved', remarks);
  };

  const handleRejected = (remarks: string) => {
    if (!canReject) return;
    handleDecision('Rejected', remarks);
  };

  const handleUpdate = () => {
    if (!request || !canUpdate) return;
    navigation.navigate('EventRequestForm', { mode: 'edit', request });
  };

  const handleCreateEvent = () => {
    if (!request || !canCreateEvent) return;
    navigation.navigate('EventForm', { mode: 'create', eventRequest: request });
  };

  const handleWithdraw = () => {
    if (!request || !canWithdraw) return;
    Alert.alert(
      validationMessages.withdraw,
      validationMessages.withdrawSure,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            try {
              setApprovingOrRejecting(true);
              await withdrawRequest(request.id);
              Alert.alert(validationMessages.withdrawSuccess);
              navigation.goBack();
            } catch (error: any) {
              Alert.alert('Error', error?.message || validationMessages.SOMETHING_WRONG);
            } finally {
              setApprovingOrRejecting(false);
            }
          },
        },
      ],
    );
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  return {
    request,
    canApprove,
    canReject,
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
    formatDate,
  };
};