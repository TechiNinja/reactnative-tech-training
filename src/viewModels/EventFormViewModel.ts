import { useState } from 'react';
import { Event, EventStatus, FormatType } from '../models/Event';
import { validationMessages } from '../constants/validationMessages';
import { useEventStore } from '../store/EventStore';
import { useAuthStore } from '../store/AuthStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Mode = 'create' | 'edit';

type EventFormParams = {
  mode: Mode;
  event?: Event;
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

type EventFormErrors = {
  name?: string;
  sport?: string;
  formats?: string;
  date?: string;
  time?: string;
  venue?: string;
  totalTeams?: string;
  description?: string;
  rules?: string;
  prizes?: string;
};

export const useEventFormViewModel = ({
  mode,
  event,
  navigation,
}: EventFormParams) => {
  const { createEvent, updateEvent } = useEventStore();
  const { user } = useAuthStore();

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

  const showDatePicker = () => setDatePickerVisible(true);
  const showTimePicker = () => setTimePickerVisible(true);

  const hideDatePicker = () => setDatePickerVisible(false);
  const hideTimePicker = () => setTimePickerVisible(false);

  const handleConfirmDate = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];
    setDate(formattedDate);
    hideDatePicker();
  };

  const handleConfirmTime = (time: Date) => {
    const formattedTime = time.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    setTime(formattedTime);
    hideTimePicker();
  };

  const isEdit = mode === 'edit' && !!event;

  const [name, setName] = useState(isEdit ? event!.name : '');
  const [sport, setSport] = useState(isEdit ? event!.sport : '');
  const [selectedFormats, setSelectedFormats] = useState<FormatType[]>(
    isEdit
      ? event!.format === '2v2'
        ? [FormatType.Singles, FormatType.Doubles]
        : [FormatType.Singles]
      : [FormatType.Singles],
  );
  const [date, setDate] = useState(isEdit ? event!.date : '');
  const [time, setTime] = useState(isEdit ? event!.time : '');
  const [venue, setVenue] = useState(isEdit ? event!.venue : '');
  const [totalTeams, setTotalTeams] = useState(
    isEdit ? String(event!.totalTeams) : '',
  );
  const [description, setDescription] = useState(
    isEdit ? event!.description : '',
  );

  const [rulesText, setRulesText] = useState(
    isEdit ? event!.rules.join('\n') : '',
  );

  const [firstPrize, setFirstPrize] = useState(
    isEdit ? event?.prizes[0] ?? '' : '',
  );
  const [secondPrize, setSecondPrize] = useState(
    isEdit ? event?.prizes[1] ?? '' : '',
  );
  const [thirdPrize, setThirdPrize] = useState(
    isEdit ? event?.prizes[2] ?? '' : '',
  );

  const [errors, setErrors] = useState<EventFormErrors>({});

  const onSportChange = (value: string) => {
    setSport(value);

    if (value.toLowerCase() === 'chess') {
      setSelectedFormats([FormatType.Singles]);
    }
  };

  const toggleFormat = (format: FormatType) => {
    setSelectedFormats((prev) =>
      prev.includes(format)
        ? prev.filter((fixture) => fixture !== format)
        : [...prev, format],
    );
  };

  const validate = () => {
    const newErrors: EventFormErrors = {};

    if (!name.trim()) newErrors.name = validationMessages.REQUIRED_EVENT_NAME;
    if (!sport.trim()) newErrors.sport = validationMessages.REQUIRED_SPORT;
    if (selectedFormats.length === 0)
      newErrors.formats = validationMessages.REQUIRED_FORMAT;
    if (
      sport.toLowerCase() === 'chess' &&
      selectedFormats.includes(FormatType.Doubles)
    ) {
      newErrors.formats = validationMessages.INVALID_CHESS_FORMAT;
    }
    if (!date.trim()) newErrors.date = validationMessages.REQUIRED_DATE;
    if (!time.trim()) newErrors.time = validationMessages.REQUIRED_TIME;
    if (!venue.trim()) newErrors.venue = validationMessages.REQUIRED_VENUE;
    if (!description.trim())
      newErrors.description = validationMessages.REQUIRED_DESCRIPTION;
    if (!rulesText.trim()) newErrors.rules = validationMessages.REQUIRED_RULES;
    if (!firstPrize.trim() || !secondPrize.trim() || !thirdPrize.trim()) {
      newErrors.prizes = validationMessages.REQUIRED_PRIZES;
    }

    if (!totalTeams || Number(totalTeams) <= 0) {
      newErrors.totalTeams = validationMessages.INVALID_TEAM_COUNT;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formattedRules = rulesText
    .split(',')
    .map((rule) => rule.trim())
    .filter((rule) => rule.length > 0)
    .map((rule) => rule.charAt(0).toUpperCase() + rule.slice(1));

  const onSubmit = () => {
    if (!validate()) return;

    const updatedEvent: Event = {
      id: event?.id ?? Date.now().toString(),
      name,
      sport,
      format: selectedFormats.includes(FormatType.Doubles) ? '2v2' : '1v1',
      date,
      time,
      venue,
      totalTeams: Number(totalTeams),

      status: event?.status ?? EventStatus.OPEN,
      registeredTeams: event?.registeredTeams ?? 0,
      registrationDeadline: event?.registrationDeadline ?? '',

      teamsCreated: event?.teamsCreated ?? false,
      fixturesCreated: event?.fixturesCreated ?? false,

      teams: event?.teams ?? [],
      fixtures: event?.fixtures ?? [],
      registrations: event?.registrations ?? [],
      description,
      rules: formattedRules,
      prizes: [firstPrize, secondPrize, thirdPrize],
      createdBy: event?.createdBy ?? user?.email,
    };

    if (isEdit) {
      updateEvent(updatedEvent);
    } else {
      createEvent(updatedEvent);
    }

    navigation.goBack();
  };

  const onBack = () => {
    navigation.goBack();
  };

  return {
    isEdit,

    name,
    sport,
    selectedFormats,
    date,
    time,
    venue,
    totalTeams,
    description,
    rulesText,
    firstPrize,
    secondPrize,
    thirdPrize,
    isDatePickerVisible,
    isTimePickerVisible,

    setName,
    setSport,
    toggleFormat,
    setDate,
    setTime,
    setVenue,
    setTotalTeams,
    setDescription,
    setRulesText,
    setFirstPrize,
    setSecondPrize,
    setThirdPrize,
    onSportChange,
    showDatePicker,
    showTimePicker,
    handleConfirmDate,
    handleConfirmTime,
    hideDatePicker,
    hideTimePicker,

    errors,
    onSubmit,
    onBack,
  };
};
