import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { RequestStatus, EventRequestResponse } from '../models/EventRequest';

type RouteType = { key: string; name: 'RequestDetails'; params: RootStackParamList['EventRequestDetails'] };

export const useEventRequestDetailsViewModel = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteType>();

  const request: EventRequestResponse | undefined = route.params?.request;

  const canUpdate = request?.status === RequestStatus.PENDING;
  const canCreateEvent = request?.status === RequestStatus.APPROVED;

  const handleBack = () => navigation.goBack();

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

  return {
    request,
    canUpdate,
    canCreateEvent,
    handleBack,
    handleUpdate,
    handleCreateEvent,
  };
};