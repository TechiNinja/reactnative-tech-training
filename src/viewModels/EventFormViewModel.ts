import { useState } from 'react';
import { Alert } from 'react-native';
import { validationMessages } from '../constants/validationMessages';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { EventRequestResponse } from '../models/EventRequest';
import { authFetch } from '../utils/authFetch';
import { EventResponse } from '../models/EventResponse';

type Mode = 'create' | 'edit';

type EventFormParams = {
  mode: Mode;
  eventRequest?: EventRequestResponse;
  event?: EventResponse;
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

type EventFormErrors = {
  name?: string;
  description?: string;
  maxParticipantsCount?: string;
  registrationDeadline?: string;
};

type CreateEventPayload = {
  eventRequestId: number;
  name: string;
  registrationDeadline: string;
  description: string;
  maxParticipantsCount: number;
};

type PatchEventPayload = {
  action: 'update' | 'cancel';
  name?: string;
  description?: string;
  maxParticipantsCount?: number;
  registrationDeadline?: string;
};

export const useEventFormViewModel = ({
  mode,
  eventRequest,
  event,
  navigation,
}: EventFormParams) => {
  const isEdit = mode === 'edit' && !!event;

  const [submitting, setSubmitting] = useState(false);
  const [isDeadlinePickerVisible, setDeadlinePickerVisible] = useState(false);

  const name_prefill = isEdit ? event!.name : eventRequest?.eventName ?? '';
  const sport        = isEdit ? event!.sportName : eventRequest?.sportsName ?? '';
  const venue        = isEdit ? event!.eventVenue : eventRequest?.requestedVenue ?? '';
  const startDate    = isEdit ? String(event!.startDate) : eventRequest?.startDate ?? '';
  const endDate      = isEdit ? String(event!.endDate) : eventRequest?.endDate ?? '';
  const gender       = isEdit ? event!.categories?.[0]?.gender ?? '' : eventRequest?.gender ?? '';
  const format       = isEdit ? event!.categories?.[0]?.format ?? '' : eventRequest?.format ?? '';

  const [name, setName]                               = useState(name_prefill);
  const [description, setDescription]                 = useState(isEdit ? event!.description : '');
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
      newErrors.registrationDeadline = 'Registration deadline is required';

    const deadline = new Date(registrationDeadline);
    const start    = new Date(startDate);
    if (registrationDeadline && deadline >= start)
      newErrors.registrationDeadline = 'Deadline must be before the start date';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;

    try {
      setSubmitting(true);

      if (isEdit) {
        const payload: PatchEventPayload = {
          action:               'update',
          name:                 name.trim(),
          description:          description.trim(),
          maxParticipantsCount: Number(maxParticipantsCount),
          registrationDeadline,
        };

        await authFetch(`/events/${event!.id}`, {
          method: 'PATCH',
          body:   JSON.stringify(payload),
        });

        Alert.alert('Success', 'Event updated successfully!');
      } else {
        if (!eventRequest) return;

        const payload: CreateEventPayload = {
          eventRequestId:      eventRequest.id,
          name:                name.trim(),
          registrationDeadline,
          description:         description.trim(),
          maxParticipantsCount: Number(maxParticipantsCount),
        };

        await authFetch('/events', {
          method: 'POST',
          body:   JSON.stringify(payload),
        });

        Alert.alert('Success', 'Event created successfully!');
      }

      navigation.navigate('AdminTabs', { screen: 'Events' });
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async () => {
    Alert.alert(
      'Cancel Event',
      'Are you sure you want to cancel this event? This cannot be undone.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel Event',
          style: 'destructive',
          onPress: async () => {
            try {
              setSubmitting(true);
              await authFetch(`/events/${event!.id}`, {
                method: 'PATCH',
                body:   JSON.stringify({ action: 'cancel' }),
              });
              Alert.alert('Success', 'Event has been cancelled.');
              navigation.navigate('AdminTabs', { screen: 'Events' });
            } catch (e: any) {
              Alert.alert('Error', e?.message ?? 'Failed to cancel event');
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