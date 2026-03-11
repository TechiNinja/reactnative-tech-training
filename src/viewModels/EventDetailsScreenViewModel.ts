import { useMemo } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { EventStatus, FormatType, GenderType } from '../models/Event';
import { useEventStore } from '../store/EventStore';
import { useAuthStore } from '../store/AuthStore';
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
};

export const useEventDetailsViewModel = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<EventDetailsRouteProp>();
  const { eventId } = route.params;

  const { events, deleteEvent } = useEventStore();
  const { user } = useAuthStore();

  const role = user?.role;

  const event = useMemo(
    () => events.find((event) => event.id === eventId) ?? null,
    [events, eventId],
  );

  const totalParticipantsPerCategory = event?.totalTeams ?? 0;
  const isChess = event?.sport.toLowerCase() === 'chess';

  const categories: Category[] = useMemo(() => {
    if (!event) return [];

    const abandonedCategories = event.abandonedCategories ?? [];

    const cats: Category[] = [];
    const genders: GenderType[] = [GenderType.Male, GenderType.Female];
    const formats: FormatType[] = event.format;

    if (isChess && formats.includes(FormatType.Singles)) {
      const allSinglesParticipants = event.registrations.filter((player) =>
        player.formats?.includes(FormatType.Singles),
      );

      const mixedTeams = event.teams.filter(
        (team) =>
          team.format === FormatType.Singles &&
          team.gender === GenderType.Mixed,
      );

      const slotsFull =
        allSinglesParticipants.length >= totalParticipantsPerCategory * 2;

      const isAbandoned = abandonedCategories.includes('Mixed-Singles');

      cats.push({
        id: 'Mixed-Singles',
        title: 'Mixed Singles',
        gender: GenderType.Mixed,
        format: FormatType.Singles,
        participantCount: allSinglesParticipants.length,
        totalParticipants: totalParticipantsPerCategory * 2,
        teamCount: mixedTeams.length,
        slotsFull,
        isAbandoned,
      });
    } else {
      genders.forEach((gender) => {
        formats.forEach((format) => {
          const participants = event.registrations.filter(
            (player) =>
              player.gender === gender && player.formats?.includes(format),
          );

          const teams = event.teams.filter(
            (team) => team.gender === gender && team.format === format,
          );

          const slotsFull = participants.length >= totalParticipantsPerCategory;

          const isAbandoned = abandonedCategories.includes(
            `${gender}-${format}`,
          );

          const genderLabel = gender === GenderType.Male ? "Men's" : "Women's";

          cats.push({
            id: `${gender}-${format}`,
            title: `${genderLabel} ${format}`,
            gender,
            format,
            participantCount: participants.length,
            totalParticipants: totalParticipantsPerCategory,
            teamCount: teams.length,
            slotsFull,
            isAbandoned,
          });
        });
      });
    }

    return cats;
  }, [event, totalParticipantsPerCategory, isChess]);

  const isAdminOrOrganizer = role === 'admin' || role === 'organizer';
  const isOwner = event?.createdBy === user?.email;

  const hasEventStarted =
    event?.status === EventStatus.LIVE ||
    event?.status === EventStatus.COMPLETED;

  const canEditOrDelete =
    (role === 'admin' || (role === 'organizer' && isOwner)) && !hasEventStarted;

  const areAllSlotsFull =
    categories.length > 0 && categories.every((cat) => cat.slotsFull);

  const canRegister =
    role === 'participant' &&
    event?.status === EventStatus.OPEN &&
    !areAllSlotsFull;

  const getRegisterButtonText = () => {
    if (areAllSlotsFull) return APP_STRINGS.eventScreen.slotsFull;
    if (event?.status !== EventStatus.OPEN)
      return APP_STRINGS.eventScreen.registrationClosed;
    return APP_STRINGS.eventScreen.register;
  };

  const handleCategoryPress = (category: Category) => {
    if (!event || !role) return;

    navigation.navigate('CategoryDetails', {
      eventId: event.id,
      gender: category.gender,
      format: category.format,
      role,
    });
  };

  const handleEditEvent = () => {
    if (!event) return;

    navigation.navigate('EventForm', {
      mode: 'edit',
      event,
    });
  };

  const handleDeleteEvent = () => {
    if (!event) return;

    Alert.alert(
      APP_STRINGS.eventScreen.deleteEvent,
      APP_STRINGS.eventScreen.deleteEventConfirmation,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: APP_STRINGS.eventScreen.delete,
          style: 'destructive',
          onPress: () => {
            deleteEvent(event.id);
            navigation.goBack();
          },
        },
      ],
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleRegister = () => {
    if (!event) return;

    navigation.navigate('EventRegister', { eventId: event.id });
  };

  return {
    event,
    role,
    categories,
    isAdminOrOrganizer,
    canEditOrDelete,
    canRegister,
    getRegisterButtonText,
    handleCategoryPress,
    handleEditEvent,
    handleDeleteEvent,
    handleBack,
    handleRegister,
  };
};
