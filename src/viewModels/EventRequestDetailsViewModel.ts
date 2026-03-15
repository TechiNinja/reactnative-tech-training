import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert } from 'react-native';
import { useState } from 'react';

import { RootStackParamList } from '../navigation/AppNavigator';
import { EventRequestResponse, RequestStatus } from '../models/EventRequest';
import { useEventRequestStore } from '../store/EventRequestStore';
import { validationMessages } from '../constants/validationMessages';
import { APP_STRINGS } from '../constants/AppStrings';

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

  const isPending = request?.status === RequestStatus.PENDING;
  const isApproved = request?.status === RequestStatus.APPROVED;

  const canUpdate = isPending;
  const canApprove = isPending;
  const canReject = isPending;
  const canWithdraw = isPending;
  const canCreateEvent = isApproved;

  const handleBack = () => {
    navigation.goBack();
  };

  const openRemarksModal = (type: OpsStatus) => {
    setDecision(type);
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
    if (!request || !isPending || !decision) return;

    const trimmedRemarks = remarks.trim();

    if (!trimmedRemarks) {
      Alert.alert(validationMessages.remarkRequired);
      return;
    }

    try {
      setApprovingOrRejecting(true);

      await decideRequest(request.id, decision, { remarks: trimmedRemarks });

      closeRemarksModal();
      Alert.alert(
        validationMessages.success,
        `${APP_STRINGS.RequestScreen.request} ${decision.toLowerCase()} ${validationMessages.successfully}`,
      );
      navigation.goBack();
    } catch (error: any) {
      Alert.alert(
        validationMessages.error,
        error?.message || validationMessages.SOMETHING_WRONG,
      );
    } finally {
      setApprovingOrRejecting(false);
    }
  };

  const handleApproved = () => {
    if (!canApprove) return;
    openRemarksModal('Approved');
  };

  const handleRejected = () => {
    if (!canReject) return;
    openRemarksModal('Rejected');
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

    navigation.navigate('EventForm', {
      mode: 'create',
    });
  };

  const handleWithdraw = () => {
    if (!request || !canWithdraw) return;

    Alert.alert(
      validationMessages.withdraw,
      validationMessages.withdrawSure,
      [
        {
          text: APP_STRINGS.RequestScreen.cancel,
          style: 'cancel',
        },
        {
          text: validationMessages.ok,
          onPress: async () => {
            try {
              setApprovingOrRejecting(true);

              await withdrawRequest(request.id);

              Alert.alert(validationMessages.withdrawSuccess);
              navigation.goBack();
            } catch (error: any) {
              Alert.alert(
                validationMessages.error,
                error?.message || validationMessages.SOMETHING_WRONG,
              );
            } finally {
              setApprovingOrRejecting(false);
            }
          },
        },
      ],
    );
  };

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);

    const day = parsedDate.getDate();
    const month = parsedDate.getMonth() + 1;
    const year = parsedDate.getFullYear();
    const hours = parsedDate.getHours();
    const minutes = parsedDate.getMinutes().toString().padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}`;
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