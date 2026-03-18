import { useState } from 'react';
import { Alert } from 'react-native';
import { validationMessages } from '../constants/validationMessages';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { EventRequestResponse } from '../models/EventRequest';
import { EventResponse } from '../models/EventResponse';
import { APP_STRINGS } from '../constants/appStrings';
import { createEvent, patchEvent, CreateEventPayload, PatchEventPayload } from '../services/eventService';

type Mode = 'create' | 'edit';

type EventFormParams = {
  mode: Mode;
  eventRequest?: EventRequestResponse;
  event?: EventResponse;
};

type EventFormErrors = {
  name?: string;
  description?: string;
  maxParticipantsCount?: string;
  registrationDeadline?: string;
};

export const useEventFormScreenViewModel = ({ mode, eventRequest, event }: EventFormParams) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const isEdit = mode === 'edit' && !!event;

  const [submitting, setSubmitting] = useState(false);
  const [isDeadlinePickerVisible, setDeadlinePickerVisible] = useState(false);

  const sport     = isEdit ? event!.sportName    : eventRequest?.sportsName      ?? '';
  const venue     = isEdit ? event!.eventVenue   : eventRequest?.requestedVenue  ?? '';
  const startDate = isEdit ? String(event!.startDate) : eventRequest?.startDate  ?? '';
  const endDate   = isEdit ? String(event!.endDate)   : eventRequest?.endDate    ?? '';
  const gender    = isEdit ? event!.categories?.[0]?.gender ?? '' : eventRequest?.gender  ?? '';
  const format    = isEdit ? event!.categories?.[0]?.format ?? '' : eventRequest?.format  ?? '';

  const [name, setName] = useState(isEdit ? event!.name : eventRequest?.eventName ?? '');
  const [description, setDescription] = useState(isEdit ? event!.description : '');
  const [maxParticipantsCount, setMaxParticipantsCount] = useState(
    isEdit ? String(event!.maxParticipantsCount) : '',
  );
  const [registrationDeadline, setRegistrationDeadline] = useState(
    isEdit ? String(event!.registrationDeadline) : '',
  );

  const [errors, setErrors] = useState<EventFormErrors>({});

  const showDeadlinePicker = () => setDeadlinePickerVisible(true);
  const hideDeadlinePicker = () => setDeadlinePickerVisible(false);

  const handleConfirmDeadline = (date: Date) => {
    setRegistrationDeadline(date.toISOString().split('T')[0]);
    hideDeadlinePicker();
  };

  const validate = () => {
    const newErrors: EventFormErrors = {};

    if (!name.trim())
      newErrors.name = validationMessages.REQUIRED_EVENT_NAME;
    if (!description.trim())
      newErrors.description = validationMessages.REQUIRED_DESCRIPTION;
    if (!maxParticipantsCount || Number(maxParticipantsCount) <= 0)
      newErrors.maxParticipantsCount = validationMessages.INVALID_TEAM_COUNT;
    if (!registrationDeadline.trim())
      newErrors.registrationDeadline = APP_STRINGS.eventFormScreen.registrationDeadlineRequired;

    const deadline = new Date(registrationDeadline);
    const start    = new Date(startDate);
    if (registrationDeadline && deadline >= start)
      newErrors.registrationDeadline = APP_STRINGS.eventFormScreen.deadlineBeforeStart;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;

    try {
      setSubmitting(true);

      if (isEdit) {
        const payload: PatchEventPayload = {
          action: 'update',
          name: name.trim(),
          description: description.trim(),
          maxParticipantsCount: Number(maxParticipantsCount),
          registrationDeadline,
        };
        await patchEvent(event!.id, payload);
        Alert.alert(APP_STRINGS.common.success, APP_STRINGS.eventFormScreen.eventUpdated);
      } else {
        if (!eventRequest) return;
        const payload: CreateEventPayload = {
          eventRequestId: eventRequest.id,
          name: name.trim(),
          registrationDeadline,
          description: description.trim(),
          maxParticipantsCount: Number(maxParticipantsCount),
        };
        await createEvent(payload);
        Alert.alert(APP_STRINGS.common.success, APP_STRINGS.eventFormScreen.eventCreated);
      }

      navigation.navigate('AdminTabs', { screen: 'Events' });
    } catch (e: any) {
      Alert.alert(APP_STRINGS.common.error, e?.message ?? APP_STRINGS.eventFormScreen.somethingWentWrong);
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async () => {
    Alert.alert(
      APP_STRINGS.eventFormScreen.cancelEvent,
      APP_STRINGS.eventFormScreen.cancelEventConfirm,
      [
        { text: APP_STRINGS.eventFormScreen.cancelNo, style: 'cancel' },
        {
          text: APP_STRINGS.eventFormScreen.cancelYes,
          style: 'destructive',
          onPress: async () => {
            try {
              setSubmitting(true);
              const payload: PatchEventPayload = { action: 'cancel' };
              await patchEvent(event!.id, payload);
              Alert.alert(APP_STRINGS.common.success, APP_STRINGS.eventFormScreen.eventCancelled);
              navigation.navigate('AdminTabs', { screen: 'Events' });
            } catch (e: any) {
              Alert.alert(APP_STRINGS.common.error, e?.message ?? APP_STRINGS.eventFormScreen.failedToCancel);
            } finally {
              setSubmitting(false);
            }
          },
        },
      ],
    );
  };

  return {
    isEdit,
    submitting,
    name,
    sport,
    venue,
    startDate,
    endDate,
    gender,
    format,
    description,
    maxParticipantsCount,
    registrationDeadline,
    isDeadlinePickerVisible,
    showDeadlinePicker,
    hideDeadlinePicker,
    handleConfirmDeadline,
    setName,
    setDescription,
    setMaxParticipantsCount,
    errors,
    onSubmit,
    onDelete,
    onBack: () => navigation.goBack(),
  };
};