import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { authFetch } from '../utils/authFetch';
import { RootStackParamList } from '../navigation/AppNavigator';
import { EventRequestResponse, RequestStatus } from '../models/EventRequest';
import { useEventRequestStore } from '../store/EventRequestStore';
import { validationMessages } from '../constants/validationMessages';
import { APP_STRINGS } from '../constants/appStrings';
import { API_ENDPOINTS } from '../config/api';

type RouteType = {
  key: string;
  name: 'EventRequestDetails';
  params: RootStackParamList['EventRequestDetails'];
};

type OpsStatus = 'Approved' | 'Rejected';

export const useEventRequestDetailsViewModel = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteType>();
  const request: EventRequestResponse | undefined = route.params?.request;

  const { withdrawRequest, decideRequest } = useEventRequestStore();

  const [approvingOrRejecting, setApprovingOrRejecting] = useState(false);
  const [remarksModalVisible, setRemarksModalVisible] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [decision, setDecision] = useState<OpsStatus | null>(null);
  const [isEventAlreadyCreated, setIsEventAlreadyCreated] = useState(false);

  const isPending = request?.status === RequestStatus.PENDING;
  const isApproved = request?.status === RequestStatus.APPROVED;

  const canUpdate = isPending;
  const canApprove = isPending;
  const canReject = isPending;
  const canWithdraw = isPending;
  const canCreateEvent = isApproved && !isEventAlreadyCreated;

  const handleBack = () => navigation.goBack();

  const checkEventExists = async () => {
    if (!request || request.status !== RequestStatus.APPROVED) {
      return;
    }

    try {
      const data = await authFetch<{ isEventAlreadyCreated: boolean }>(
  API_ENDPOINTS.EVENTS.REQUEST_PREFILL(request.id)
);

      setIsEventAlreadyCreated(data?.isEventAlreadyCreated ?? false);
    } catch {
      setIsEventAlreadyCreated(false);
    }
  };

  useEffect(() => {
    checkEventExists();
  }, [request?.id, request?.status]);

  useFocusEffect(
    useCallback(() => {
      checkEventExists();
    }, [request?.id])
  );

  const openRemarksModal = () => {
    setDecision(RequestStatus.REJECTED);
    setRemarks('');
    setRemarksModalVisible(true);
  };

  const closeRemarksModal = () => {
    if (approvingOrRejecting) return;

    setRemarksModalVisible(false);
    setDecision(null);
    setRemarks('');
  };

  const handleDecision = async () => {
    if (!request || !isPending || decision !== 'Rejected') return;

    const trimmedRemarks = remarks.trim();

    if (!trimmedRemarks) {
      Alert.alert(validationMessages.REMARK_REQUIRED);
      return;
    }

    try {
      setApprovingOrRejecting(true);

      await decideRequest(request.id, {
        status: RequestStatus.REJECTED,
        remarks: trimmedRemarks,
      });

      closeRemarksModal();
      Alert.alert(
        validationMessages.SUCCESS,
        `${APP_STRINGS.RequestScreen.request} rejected ${validationMessages.SUCCESSFULLY}`,
      );
      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        validationMessages.ERROR,
        error?.message || validationMessages.SOMETHING_WRONG,
      );
    } finally {
      setApprovingOrRejecting(false);
    }
  };

  const handleApproved = async () => {
    if (!request || !canApprove) return;

    try {
      setApprovingOrRejecting(true);

      await decideRequest(request.id, {
        status: RequestStatus.APPROVED,
        remarks: '',
      });

      Alert.alert(
        validationMessages.SUCCESS,
        `${APP_STRINGS.RequestScreen.request} approved ${validationMessages.SUCCESSFULLY}`,
      );
      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        validationMessages.ERROR,
        error?.message || validationMessages.SOMETHING_WRONG,
      );
    } finally {
      setApprovingOrRejecting(false);
    }
  };

  const handleRejected = () => {
    if (!canReject) return;
    openRemarksModal();
  };

  const handleUpdate = () => {
    if (!request || !canUpdate) return;
    navigation.navigate('EventRequestForm', { mode: 'edit', request });
  };

  // ✅ 🔥 SAFE create event handler
  const handleCreateEvent = () => {
    if (!request) return;

    if (!canCreateEvent) {
      Alert.alert("Event already created for this request");
      return;
    }

    navigation.navigate('EventForm', {
      mode: 'create',
      eventRequest: request,
    });
  };

  const handleWithdraw = () => {
    if (!request || !canWithdraw) return;

    Alert.alert(validationMessages.WITHDRAW, validationMessages.WITHDRAW_SURE, [
      {
        text: APP_STRINGS.RequestScreen.cancel,
        style: 'cancel',
      },
      {
        text: validationMessages.OK,
        onPress: async () => {
          try {
            setApprovingOrRejecting(true);
            await withdrawRequest(request.id);
            Alert.alert(validationMessages.WITHDRAWSUCCESS);
            navigation.goBack();
          } catch (error: any) {
            Alert.alert(
              validationMessages.ERROR,
              error?.message || validationMessages.SOMETHING_WRONG,
            );
          } finally {
            setApprovingOrRejecting(false);
          }
        },
      },
    ]);
  };

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);

    const day = parsedDate.getDate();
    const month = parsedDate.getMonth() + 1;
    const year = parsedDate.getFullYear();
    const hours = parsedDate.getHours();
    const minutes = parsedDate.getMinutes().toString().padStart(2, '0');

    return `${day}-${month}-${year}, ${hours}:${minutes}`;
  };

  return {
    request,
    remarks,
    remarksModalVisible,
    approvingOrRejecting,
    canApprove,
    canReject,
    canUpdate,
    canCreateEvent,
    canWithdraw,
    isSubmitDisabled: !remarks.trim() || approvingOrRejecting,
    setRemarks,
    handleBack,
    handleApproved,
    handleRejected,
    handleCreateEvent,
    handleUpdate,
    handleWithdraw,
    openRemarksModal,
    closeRemarksModal,
    submitDecision: handleDecision,
    formatDate,
  };
};