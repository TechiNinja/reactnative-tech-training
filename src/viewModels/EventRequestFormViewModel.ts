import { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/AppNavigator';
import {
  CreateEventRequest,
  EditEventRequest,
  EventRequestResponse,
  GenderType,
  MatchFormat,
  Sport,
} from '../models/EventRequest';
import { validationMessages } from '../constants/validationMessages';
import { eventRequestService } from '../services/eventRequestService';
import { useEventRequestStore } from '../store/EventRequestStore';
import { APP_STRINGS } from '../constants/appStrings';

type Mode = 'create' | 'edit';

type Params = {
  mode: Mode;
  request?: EventRequestResponse;
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

type Errors = Partial<
  Record<
    'eventName' | 'sportId' | 'requestedVenue' | 'startDate' | 'endDate',
    string
  >
>;

type FormatOption = {
  value: MatchFormat;
};

type GenderOption = {
  value: GenderType;
};

const toYmd = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const getInitialFormat = (
  isEdit: boolean,
  request?: EventRequestResponse,
): MatchFormat | '' => {
  if (isEdit && request) {
    return request.format;
  }

  return '';
};

export const useEventRequestFormViewModel = ({
  mode,
  request,
  navigation,
}: Params) => {
  const isEdit = mode === 'edit' && !!request;
  const { createRequest, updateRequest } = useEventRequestStore();

  const [eventName, setEventName] = useState(isEdit ? request.eventName : '');
  const [sportId, setSportId] = useState<number>(isEdit ? request.sportId : 0);
  const [gender, setGender] = useState<GenderType>(
    isEdit ? request.gender : GenderType.Male,
  );
  const [format, setFormat] = useState<MatchFormat | ''>(
    getInitialFormat(isEdit, request),
  );
  const [requestedVenue, setRequestedVenue] = useState(
    isEdit ? request.requestedVenue : '',
  );
  const [logisticsRequirements, setLogisticsRequirements] = useState(
    isEdit ? request.logisticsRequirements : '',
  );
  const [startDate, setStartDate] = useState(isEdit ? request.startDate : '');
  const [endDate, setEndDate] = useState(isEdit ? request.endDate : '');

  const [errors, setErrors] = useState<Errors>({});
  const [sports, setSports] = useState<Sport[]>([]);
  const [sportsLoading, setSportsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSportList, setShowSportList] = useState(false);

  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);

  useEffect(() => {
    if (isEdit) {
      return;
    }

    const loadSports = async () => {
      try {
        setSportsLoading(true);
        const data = await eventRequestService.getSports();
        setSports(data);
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert(
            validationMessages.ERROR,
            error.message || validationMessages.SOMETHING_WRONG,
          );
        }
      } finally {
        setSportsLoading(false);
      }
    };

    loadSports();
  }, [isEdit]);

  const selectedSportName = useMemo(() => {
    if (isEdit) {
      return request?.sportsName ?? '';
    }

    return sports.find(sport => sport.id === sportId)?.name ?? '';
  }, [isEdit, request?.sportsName, sports, sportId]);

  const genderOptions = useMemo<GenderOption[]>(() => {
    return Object.values(GenderType).map(value => ({ value }));
  }, []);

  const formatOptions = useMemo<FormatOption[]>(() => {
    if (isEdit) {
      return Object.values(MatchFormat).map(value => ({ value }));
    }

    const selectedSport = sports.find(sport => sport.id === sportId);

    if (!selectedSport) {
      return [];
    }

    return selectedSport.allowedFormats.map(value => ({ value }));
  }, [isEdit, sportId, sports]);

  useEffect(() => {
    if (isEdit) {
      return;
    }

    const selectedSport = sports.find(sport => sport.id === sportId);

    if (!selectedSport) {
      return;
    }

    if (!selectedSport.allowedFormats.includes(format as MatchFormat)) {
      setFormat(selectedSport.allowedFormats[0] ?? '');
    }
  }, [isEdit, sportId, sports, format]);

  const validate = () => {
    const nextErrors: Errors = {};

    if (!eventName.trim()) {
      nextErrors.eventName = validationMessages.EVENTNAME_REQUIRED;
    }

    if (!isEdit && sportId <= 0) {
      nextErrors.sportId = validationMessages.SPORT_REQUIRED;
    }

    if (!requestedVenue.trim()) {
      nextErrors.requestedVenue = validationMessages.VENUE_REQUIRED;
    }

    if (!startDate) {
      nextErrors.startDate = validationMessages.STARTDATE_REQUIRED;
    }

    if (!endDate) {
      nextErrors.endDate = validationMessages.ENDDATE_REQUIRED;
    }

    if (startDate && endDate && startDate > endDate) {
      nextErrors.endDate = validationMessages.DATE_COMPARE;
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) {
      return;
    }

    if (!format) {
      return;
    }

    try {
      setSubmitting(true);

      if (isEdit && request) {
        const payload: EditEventRequest = {
          eventName: eventName.trim(),
          requestedVenue: requestedVenue.trim(),
          logisticsRequirements: logisticsRequirements.trim(),
          format,
          gender,
          startDate,
          endDate,
        };

        await updateRequest(request.id, payload);
      } else {
        const payload: CreateEventRequest = {
          eventName: eventName.trim(),
          sportId,
          requestedVenue: requestedVenue.trim(),
          logisticsRequirements: logisticsRequirements.trim(),
          format,
          gender,
          startDate,
          endDate,
        };

        await createRequest(payload);
      }

      navigation.navigate('AdminTabs', { screen: 'Request' });
    } catch (error: any) {
      Alert.alert(
        validationMessages.ERROR,
        error?.message || validationMessages.SOMETHING_WRONG,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const safeDateFromYmd = (ymd?: string) => {
    if (!ymd) {
      return new Date();
    }

    const [year, month, day] = ymd.split('-').map(Number);

    if (!year || !month || !day) {
      return new Date();
    }

    return new Date(year, month - 1, day);
  };

  const onSelectSport = (selectedSportId: number) => {
    setSportId(selectedSportId);
    setShowSportList(false);
  };

  const toggleSportList = () => {
    setShowSportList(previous => !previous);
  };

  const showStartPicker = () => {
    setStartPickerVisible(true);
  };

  const hideStartPicker = () => {
    setStartPickerVisible(false);
  };

  const showEndPicker = () => {
    setEndPickerVisible(true);
  };

  const hideEndPicker = () => {
    setEndPickerVisible(false);
  };

  const onConfirmStartDate = (date: Date) => {
    setStartDate(toYmd(date));
    hideStartPicker();
  };

  const onConfirmEndDate = (date: Date) => {
    setEndDate(toYmd(date));
    hideEndPicker();
  };

  const onBack = () => {
    navigation.goBack();
  };

  const screenTitle = isEdit
    ? APP_STRINGS.RequestScreen.editRequest
    : APP_STRINGS.RequestScreen.raiseRequest;

  const submitButtonTitle = isEdit
    ? APP_STRINGS.RequestScreen.updateRequest
    : APP_STRINGS.RequestScreen.raiseRequest;

  const sportPlaceholder = sportsLoading
    ? APP_STRINGS.placeHolders.loadingSports
    : APP_STRINGS.placeHolders.selectSports;

  return {
    isEdit,
    submitting,
    screenTitle,
    submitButtonTitle,
    sportPlaceholder,
    showSportList,
    eventName,
    sportId,
    selectedSportName,
    gender,
    format,
    requestedVenue,
    logisticsRequirements,
    startDate,
    endDate,
    sports,
    sportsLoading,
    errors,
    genderOptions,
    formatOptions,
    isStartPickerVisible,
    isEndPickerVisible,
    setEventName,
    setSportId,
    setGender,
    setFormat,
    setRequestedVenue,
    setLogisticsRequirements,
    toggleSportList,
    onSelectSport,
    showStartPicker,
    hideStartPicker,
    showEndPicker,
    hideEndPicker,
    onConfirmStartDate,
    onConfirmEndDate,
    safeDateFromYmd,
    onSubmit,
    onBack,
  };
};