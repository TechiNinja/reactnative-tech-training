import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuthStore } from '../store/AuthStore';
import { FormatType, GenderType } from '../models/Event';
import { APP_STRINGS } from '../constants/appStrings';
import { authFetch } from '../utils/authFetch';
import { API_ENDPOINTS } from '../config/api';
import { getEventById } from '../services/eventService';
import { EventResponse, EventCategoryResponse } from '../models/EventResponse';

type RegistrationResponse = {
  id: number;
  userId: number;
  name: string;
  eventCategoryId: number;
  registeredAt: string;
};

export const useEventRegistrationViewModel = (
  navigation: NativeStackNavigationProp<RootStackParamList>,
  route: RouteProp<RootStackParamList, 'EventRegister'>,
) => {
  const { eventId } = route.params;
  const { user } = useAuthStore();

  const [event, setEvent] = useState<EventResponse | null>(null);
  const [registrationCounts, setRegistrationCounts] = useState<Record<number, number>>({});
  const [myRegisteredCategoryIds, setMyRegisteredCategoryIds] = useState<Set<number>>(new Set());
  const [myRegisteredGender, setMyRegisteredGender] = useState<GenderType | null>(null);
  const [loading, setLoading] = useState(true);
  const [playerName] = useState(user?.name ?? '');
  const [gender, setGender] = useState<GenderType | ''>('');
  const [selectedFormats, setSelectedFormats] = useState<FormatType[]>([]);

  const fetchEventData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getEventById(Number(eventId));
      if (!data || data.length === 0) return;
      const ev = data[0];
      setEvent(ev);

      const counts: Record<number, number> = {};
      const myCatIds = new Set<number>();

      await Promise.all(
        (ev.categories ?? []).map(async (cat) => {
          const regs = await authFetch<RegistrationResponse[]>(
            API_ENDPOINTS.REGISTRATIONS.BY_CATEGORY(cat.id),
          );
          const list = regs ?? [];
          counts[cat.id] = list.length;
          if (list.some((r) => r.userId === user?.id)) {
            myCatIds.add(cat.id);
          }
        }),
      );

      setRegistrationCounts(counts);
      setMyRegisteredCategoryIds(myCatIds);

      if (myCatIds.size > 0) {
        const registeredCat = ev.categories?.find((cat) => myCatIds.has(cat.id));
        if (registeredCat) {
          setMyRegisteredGender(registeredCat.gender as GenderType);
          setGender(registeredCat.gender as GenderType);
        }
      }
    } catch {
      Alert.alert(APP_STRINGS.common.error, APP_STRINGS.registrationScreen.failedToLoadEvent);
    } finally {
      setLoading(false);
    }
  }, [eventId, user?.id]);

  useEffect(() => {
    fetchEventData();
  }, [fetchEventData]);

  const getCategory = (g: GenderType, format: FormatType): EventCategoryResponse | undefined =>
    event?.categories?.find((cat) => cat.gender === g && cat.format === format);

  const totalSlotsPerCategory = event?.maxParticipantsCount ?? 0;

  const getCategoryCount = (g: GenderType, format: FormatType): number => {
    const cat = getCategory(g, format);
    return cat ? (registrationCounts[cat.id] ?? 0) : 0;
  };

  const isCategoryFull = (g: GenderType, format: FormatType): boolean => {
    if (!event) return false;
    return getCategoryCount(g, format) >= totalSlotsPerCategory;
  };

  const isAlreadyRegistered = (g: GenderType, format: FormatType): boolean => {
    const cat = getCategory(g, format);
    return cat ? myRegisteredCategoryIds.has(cat.id) : false;
  };

  const isFullyRegistered = (g: GenderType): boolean => {
    if (!g || !event) return false;
    const genderCats = event.categories?.filter((cat) => cat.gender === g) ?? [];
    return genderCats.length > 0 && genderCats.every((cat) => myRegisteredCategoryIds.has(cat.id));
  };

  const availableFormats: FormatType[] = [
    ...new Set(event?.categories?.map((c) => c.format as FormatType) ?? []),
  ];

  const toggleFormat = (format: FormatType) => {
    if (!gender) return;

    if (isAlreadyRegistered(gender, format)) {
      Alert.alert(
        APP_STRINGS.registrationScreen.alreadyRegistered,
        APP_STRINGS.registrationScreen.alreadyRegisteredForFormat(gender, format),
      );
      return;
    }

    if (isCategoryFull(gender, format)) {
      Alert.alert(
        APP_STRINGS.eventScreen.registrationClosed,
        APP_STRINGS.registrationScreen.categoryFullAlert(gender, format),
      );
      return;
    }

    setSelectedFormats((prev) =>
      prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format],
    );
  };

  const handleGenderChange = (newGender: GenderType) => {
    if (myRegisteredGender && myRegisteredGender !== newGender) {
      Alert.alert(
        APP_STRINGS.registrationScreen.notAllowed,
        APP_STRINGS.registrationScreen.cannotSwitchGender(myRegisteredGender, newGender),
      );
      return;
    }
    setGender(newGender);
    setSelectedFormats((prev) =>
      prev.filter(
        (format) => !isAlreadyRegistered(newGender, format) && !isCategoryFull(newGender, format),
      ),
    );
  };

  const onRegister = async () => {
    if (!user || !gender || selectedFormats.length === 0) return;

    const alreadyRegisteredFormats = selectedFormats.filter((f) => isAlreadyRegistered(gender, f));
    if (alreadyRegisteredFormats.length > 0) {
      Alert.alert(
        APP_STRINGS.registrationScreen.alreadyRegistered,
        APP_STRINGS.registrationScreen.alreadyRegisteredMultiple(alreadyRegisteredFormats.join(', ')),
      );
      return;
    }

    try {
      await Promise.all(
        selectedFormats.map((format) => {
          const cat = getCategory(gender, format);
          if (!cat) throw new Error(APP_STRINGS.registrationScreen.categoryNotFound(gender, format));
          return authFetch(API_ENDPOINTS.PARTICIPANT.REGISTER, {
            method: 'POST',
            body: JSON.stringify({ userId: user.id, eventCategoryId: cat.id }),
          });
        }),
      );
      Alert.alert(APP_STRINGS.common.success, APP_STRINGS.eventScreen.registrationSuccessfull);
      navigation.goBack();
    } catch {
      Alert.alert(APP_STRINGS.common.error, APP_STRINGS.eventScreen.registrationFailed);
    }
  };

  const isAlreadyFullyRegistered = gender !== '' ? isFullyRegistered(gender as GenderType) : false;

  const isFormValid =
    playerName.length > 0 &&
    gender !== '' &&
    selectedFormats.length > 0 &&
    !isAlreadyFullyRegistered &&
    !selectedFormats.every((f) => isAlreadyRegistered(gender as GenderType, f));

  return {
    playerName,
    setPlayerName: () => {},
    gender,
    myRegisteredGender,
    selectedFormats,
    availableFormats,
    totalSlotsPerCategory,
    loading,
    isAlreadyFullyRegistered,
    setGender: handleGenderChange,
    toggleFormat,
    onBack: () => navigation.goBack(),
    onRegister,
    isFormValid,
    isCategoryFull,
    isAlreadyRegistered,
    getCategoryCount,
  };
};