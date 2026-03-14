import { useCallback, useEffect, useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FormatType, GenderType } from '../models/Event';
import { useAuthStore } from '../store/AuthStore';
import { authFetch } from '../utils/authFetch';
import { EventResponse, EventCategoryResponse } from '../models/EventResponse';

type EventDetailsRouteProp = RouteProp<RootStackParamList, 'EventDetails'>;

type Category = {
  id: string;
  title: string;
  gender: GenderType;
  format: FormatType;
  participantCount: number;
  totalParticipants: number;
  teamCount: number;
  slotsFull: boolean;
  isAbandoned: boolean;
  eventCategoryId: number;
};

const mapGender = (gender: string): GenderType => {
  if (gender === 'Female') return GenderType.Female;
  if (gender === 'Mixed') return GenderType.Mixed;
  return GenderType.Male;
};

const mapFormat = (format: string): FormatType => {
  if (format === 'Doubles') return FormatType.Doubles;
  return FormatType.Singles;
};

const mapCategory = (cat: EventCategoryResponse, maxParticipants: number): Category => {
  const gender = mapGender(cat.gender);
  const format = mapFormat(cat.format);
  const genderLabel =
    gender === GenderType.Female ? "Women's" : gender === GenderType.Mixed ? 'Mixed' : "Men's";
  const isAbandoned = cat.status === 'Abandoned';

  return {
    id: String(cat.id),
    title: `${genderLabel} ${format}`,
    gender,
    format,
    participantCount: 0,
    totalParticipants: maxParticipants,
    teamCount: 0,
    slotsFull: false,
    isAbandoned,
    eventCategoryId: cat.id,
  };
};

export const useEventDetailsViewModel = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<EventDetailsRouteProp>();
  const { eventId, role } = route.params;
  const { user } = useAuthStore();

  const [event, setEvent] = useState<EventResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAssignOrganizer, setShowAssignOrganizer] = useState(false);

  const fetchEvent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await authFetch<EventResponse[]>(`/events?id=${eventId}`);
      if (data && data.length > 0) {
        setEvent(data[0]);
      } else {
        setError('Event not found');
      }
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load event');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const categories: Category[] = (event?.categories ?? []).map((cat) =>
    mapCategory(cat, event?.maxParticipantsCount ?? 0),
  );

  const hasEventStarted = event?.status === 'Live' || event?.status === 'Completed';

  const canEditOrDelete =
    (role === 'admin' || role === 'organizer') && !hasEventStarted && event?.status !== 'Cancelled';

  const canAssignOrganizer = role === 'admin' && !hasEventStarted && event?.status !== 'Cancelled';

  const canPublish = role === 'admin' && event?.status === 'Upcoming';

  const canRegister = role === 'participant' && event?.status === 'Open';

  const getRegisterButtonText = () => {
    if (event?.status !== 'Open') return 'Registration Closed';
    return 'Register';
  };

  const handleCategoryPress = (category: Category) => {
    if (!event || !role) return;
    navigation.navigate('CategoryDetails', {
      eventId: String(event.id),
      gender: category.gender,
      format: category.format,
      role,
      eventCategoryId: category.eventCategoryId,
    });
  };

  const handleEditEvent = () => {
    if (!event) return;
    navigation.navigate('EventForm', { mode: 'edit', event });
  };

  const handleBack = () => navigation.goBack();

  const handleRegister = () => {
    if (!event) return;
    navigation.navigate('EventRegister', { eventId: String(event.id) });
  };

  const handleOpenAssignOrganizer = () => setShowAssignOrganizer(true);
  const handleCloseAssignOrganizer = () => setShowAssignOrganizer(false);
  const handleAssignOrganizerSuccess = () => {
    setShowAssignOrganizer(false);
    fetchEvent();
  };

  const handlePublish = async () => {
    if (!event) return;
    try {
      await authFetch(`/events/${event.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ action: 'publish' }),
      });
      fetchEvent();
    } catch (e: any) {
      console.error('Publish failed:', e?.message);
    }
  };

  return {
    event,
    loading,
    error,
    role,
    categories,
    canEditOrDelete,
    canAssignOrganizer,
    canPublish,
    canRegister,
    showAssignOrganizer,
    getRegisterButtonText,
    handleCategoryPress,
    handleEditEvent,
    handleBack,
    handleRegister,
    handleOpenAssignOrganizer,
    handleCloseAssignOrganizer,
    handleAssignOrganizerSuccess,
    handlePublish,
  };
};