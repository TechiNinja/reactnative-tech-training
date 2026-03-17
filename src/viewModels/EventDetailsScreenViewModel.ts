import { useCallback, useState } from 'react';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FormatType, GenderType } from '../models/Event';
import { useAuthStore } from '../store/AuthStore';
import { authFetch } from '../utils/authFetch';
import { EventResponse, EventCategoryResponse } from '../models/EventResponse';
import { API_ENDPOINTS } from '../config/api';
import { APP_STRINGS } from '../constants/AppStrings';

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

type ParticipantRegistration = {
  id: number;
  userId: number;
  name: string;
  eventCategoryId: number;
  registeredAt: string;
};

type TeamResponse = {
  id: number;
  name: string;
  members: string[];
  eventCategoryId: number;
};

const EventStatus = {
  LIVE:      'Live',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  OPEN:      'Open',
  ABANDONED: 'Abandoned',
} as const;

const GenderValue = {
  FEMALE: 'Female',
  MIXED:  'Mixed',
  MALE:   'Male',
} as const;

const FormatValue = {
  DOUBLES: 'Doubles',
} as const;

const mapGender = (gender: string): GenderType => {
  if (gender === GenderValue.FEMALE) return GenderType.Female;
  if (gender === GenderValue.MIXED)  return GenderType.Mixed;
  return GenderType.Male;
};

const mapFormat = (format: string): FormatType => {
  if (format === FormatValue.DOUBLES) return FormatType.Doubles;
  return FormatType.Singles;
};

const mapCategory = (
  cat: EventCategoryResponse,
  maxParticipants: number,
  registrations: ParticipantRegistration[],
  teamCounts: Record<number, number>,
): Category => {
  const gender = mapGender(cat.gender);
  const format = mapFormat(cat.format);
  const genderLabel =
    gender === GenderType.Female
      ? APP_STRINGS.eventScreen.womens
      : gender === GenderType.Mixed
      ? APP_STRINGS.eventScreen.mixed
      : APP_STRINGS.eventScreen.mens;
  const isAbandoned      = cat.status === EventStatus.ABANDONED;
  const participantCount = registrations.filter((r) => r.eventCategoryId === cat.id).length;
  const teamCount        = teamCounts[cat.id] ?? 0;
  const slotsFull        = participantCount >= maxParticipants;

  return {
    id: String(cat.id),
    title: `${genderLabel} ${format}`,
    gender,
    format,
    participantCount,
    totalParticipants: maxParticipants,
    teamCount,
    slotsFull,
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
  const [registrations, setRegistrations] = useState<ParticipantRegistration[]>([]);
  const [teamCounts, setTeamCounts] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAssignOrganizer, setShowAssignOrganizer] = useState(false);

  const fetchEvent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await authFetch<EventResponse[]>(`/events?id=${eventId}`);
      if (data && data.length > 0) {
        const ev = data[0];
        setEvent(ev);
        const cats = ev.categories ?? [];

        const [allRegs, allTeams] = await Promise.all([
          Promise.all(
            cats.map((cat) =>
              authFetch<ParticipantRegistration[]>(
                API_ENDPOINTS.REGISTRATIONS.BY_CATEGORY(cat.id),
              ).then((r) => r ?? []),
            ),
          ),
          Promise.all(
            cats
              .filter((cat) => mapFormat(cat.format) === FormatType.Doubles)
              .map((cat) =>
                authFetch<TeamResponse[]>(
                  API_ENDPOINTS.ORGANIZER.GET_TEAMS(cat.id),
                ).then((r) => ({ catId: cat.id, count: (r ?? []).length })),
              ),
          ),
        ]);

        setRegistrations(allRegs.flat());
        const counts: Record<number, number> = {};
        allTeams.forEach(({ catId, count }) => { counts[catId] = count; });
        setTeamCounts(counts);
      } else {
        setError(APP_STRINGS.eventScreen.eventNotFound);
      }
    } catch (e: any) {
      setError(e?.message ?? APP_STRINGS.eventScreen.failedToLoad);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useFocusEffect(
    useCallback(() => { fetchEvent(); }, [fetchEvent]),
  );

  const categories: Category[] = (event?.categories ?? []).map((cat) =>
    mapCategory(cat, event?.maxParticipantsCount ?? 0, registrations, teamCounts),
  );

  const hasEventStarted =
    event?.status === EventStatus.LIVE || event?.status === EventStatus.COMPLETED;

  const canEditOrDelete =
    (role === 'admin' || role === 'organizer') &&
    !hasEventStarted &&
    event?.status !== EventStatus.CANCELLED;

  const canAssignOrganizer =
    role === 'admin' && !hasEventStarted && event?.status !== EventStatus.CANCELLED;

  const canRegister = role === 'participant' && event?.status === EventStatus.OPEN;

  const getRegisterButtonText = () => {
    if (event?.status !== EventStatus.OPEN) return APP_STRINGS.eventScreen.registrationClosed;
    return APP_STRINGS.eventScreen.register;
  };

  const handleCategoryPress = (category: Category) => {
    if (!event || !role) return;
    navigation.navigate('CategoryDetails', {
      eventId: String(event.id),
      gender: category.gender,
      format: category.format,
      role,
      eventCategoryId: category.eventCategoryId,
      eventStartDate: String(event.startDate),
      eventEndDate: String(event.endDate),
      eventVenue: event.eventVenue,
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

  const handleOpenAssignOrganizer  = () => setShowAssignOrganizer(true);
  const handleCloseAssignOrganizer = () => setShowAssignOrganizer(false);
  const handleAssignOrganizerSuccess = () => {
    setShowAssignOrganizer(false);
    fetchEvent();
  };

  return {
    event,
    loading,
    error,
    role,
    categories,
    canEditOrDelete,
    canAssignOrganizer,
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
  };
};