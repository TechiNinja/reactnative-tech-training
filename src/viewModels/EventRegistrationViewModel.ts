import { useState, useMemo } from 'react';
import { Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { RouteProp } from '@react-navigation/native';
import { useEventStore } from '../store/EventStore';
import { useAuthStore } from '../store/AuthStore';
import { FormatType, GenderType } from '../models/Event';
import { APP_STRINGS } from '../constants/AppStrings';

export const useEventRegistrationViewModel = (
  navigation: NativeStackNavigationProp<RootStackParamList>,
  route: RouteProp<RootStackParamList, 'EventRegister'>,
) => {
  const { eventId } = route.params;
  const { events, registerParticipant } = useEventStore();
  const { user } = useAuthStore();

  const event = useMemo(
    () => events.find((event) => event.id === eventId),
    [events, eventId],
  );

  const [playerName, setPlayerName] = useState(user?.name ?? '');
  const [gender, setGender] = useState<GenderType | ''>('');
  const [selectedFormats, setSelectedFormats] = useState<FormatType[]>([]);

  const availableFormats: FormatType[] = event?.format ?? [];

  const totalSlotsPerCategory = event?.totalTeams ?? 0;

  const isCategoryFull = (
    checkGender: GenderType,
    format: FormatType,
  ): boolean => {
    if (!event) return false;
    const count = event.registrations.filter(
      (reg) => reg.gender === checkGender && reg.formats?.includes(format),
    ).length;
    return count >= totalSlotsPerCategory;
  };

  const getCategoryCount = (
    checkGender: GenderType,
    format: FormatType,
  ): number => {
    if (!event) return 0;
    return event.registrations.filter(
      (reg) => reg.gender === checkGender && reg.formats?.includes(format),
    ).length;
  };

  const toggleFormat = (format: FormatType) => {
    if (gender && !selectedFormats.includes(format)) {
      if (isCategoryFull(gender, format)) {
        const genderLabel = gender === GenderType.Male ? "Men's" : "Women's";
        Alert.alert(
          APP_STRINGS.eventScreen.registrationClosed,
          `${genderLabel} ${format} category is full. Please choose another category.`,
        );
        return;
      }
    }

    setSelectedFormats((prev) =>
      prev.includes(format)
        ? prev.filter((fmt) => fmt !== format)
        : [...prev, format],
    );
  };

  const handleGenderChange = (newGender: GenderType) => {
    setGender(newGender);
    setSelectedFormats((prev) =>
      prev.filter((format) => !isCategoryFull(newGender, format)),
    );
  };

  const onBack = () => {
    navigation.goBack();
  };

  const onRegister = () => {
    if (!playerName || !gender || selectedFormats.length === 0) return;

    const fullCategories = selectedFormats.filter((format) =>
      isCategoryFull(gender, format),
    );

    if (fullCategories.length > 0) {
      const genderLabel = gender === GenderType.Male ? "Men's" : "Women's";
      Alert.alert(
        APP_STRINGS.auth.registrationFailed,
        `${genderLabel} ${fullCategories.join(
          ', ',
        )} category is now full. Please choose another category.`,
      );
      setSelectedFormats((prev) =>
        prev.filter((format) => !fullCategories.includes(format)),
      );
      return;
    }

    if (event) {
      const alreadyRegisteredInSelected = event.registrations.some((reg) => {
        if (reg.name !== playerName || reg.gender !== gender) return false;
        return selectedFormats.some((format) => reg.formats?.includes(format));
      });

      if (alreadyRegisteredInSelected) {
        Alert.alert(
          APP_STRINGS.auth.registrationFailed,
          APP_STRINGS.eventScreen.registered,
        );
        return;
      }
    }

    registerParticipant(eventId, playerName, gender, selectedFormats);
    navigation.goBack();
  };

  const isFormValid =
    playerName.length > 0 && gender !== '' && selectedFormats.length > 0;

  return {
    playerName,
    gender,
    selectedFormats,
    availableFormats,
    totalSlotsPerCategory,
    setPlayerName,
    setGender: handleGenderChange,
    toggleFormat,
    onBack,
    onRegister,
    isFormValid,
    isCategoryFull,
    getCategoryCount,
  };
};
