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

type Mode = 'create' | 'edit';

type Params = {
  mode: Mode;
  request?: EventRequestResponse;
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

type Errors = Partial<
  Record<'eventName' | 'sportId' | 'requestedVenue' | 'startDate' | 'endDate', string>
>;

const toYmd = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const useEventRequestFormViewModel = ({ mode, request, navigation }: Params) => {
  const isEdit = mode === 'edit' && !!request;

  const [eventName, setEventName] = useState(isEdit ? request!.eventName : '');
  const [sportId, setSportId] = useState(isEdit ? request!.sportId : 0);
  const [gender, setGender] = useState<GenderType>(isEdit ? request!.gender : GenderType.Male);
  const [format, setFormat] = useState<MatchFormat>(
    isEdit ? request!.format : MatchFormat.Singles,
  );
  const [requestedVenue, setRequestedVenue] = useState(
    isEdit ? request!.requestedVenue : '',
  );
  const [logisticsRequirements, setLogisticsRequirements] = useState(
    isEdit ? request!.logisticsRequirements : '',
  );
  const [startDate, setStartDate] = useState(isEdit ? request!.startDate : '');
  const [endDate, setEndDate] = useState(isEdit ? request!.endDate : '');

  const [errors, setErrors] = useState<Errors>({});
  const [sports, setSports] = useState<Sport[]>([]);
  const [sportsLoading, setSportsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);

  useEffect(() => {
    if (isEdit) return;

    const loadSports = async () => {
      try {
        setSportsLoading(true);
        const data = await eventRequestService.getSports();
        setSports(data);
      } catch (error: any) {
        Alert.alert(validationMessages.ERROR, error?.message || validationMessages.SOMETHING_WRONG);
      } finally {
        setSportsLoading(false);
      }
    };

    loadSports();
  }, [isEdit]);

  const selectedSportName = useMemo(() => {
    if (isEdit) return request?.sportsName ?? '';
    return sports.find((s) => s.id === sportId)?.name ?? '';
  }, [isEdit, request?.sportsName, sports, sportId]);

  const genderOptions = useMemo(
    () => Object.values(GenderType).map((value) => ({ value, disabled: false })),
    [],
  );

  const formatOptions = useMemo(
    () => Object.values(MatchFormat).map((value) => ({ value, disabled: false })),
    [],
  );

  const validate = () => {
    const nextErrors: Errors = {};

    if (!eventName.trim()) nextErrors.eventName = validationMessages.EVENTNAME_REQUIRED;
    if (!isEdit && sportId <= 0) nextErrors.sportId = validationMessages.SPORT_REQUIRED;
    if (!requestedVenue.trim()) nextErrors.requestedVenue = validationMessages.VENUE_REQUIRED;
    if (!startDate) nextErrors.startDate = validationMessages.STARTDATE_REQUIRED;
    if (!endDate) nextErrors.endDate = validationMessages.ENDDATE_REQUIRED;
    if (startDate && endDate && startDate > endDate) {
      nextErrors.endDate = validationMessages.DATE_COMPARE;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;

    try {
      setSubmitting(true);

      if (isEdit) {
        const payload: EditEventRequest = {
          eventName: eventName.trim(),
          requestedVenue: requestedVenue.trim(),
          logisticsRequirements: logisticsRequirements.trim(),
          format,
          gender,
          startDate,
          endDate,
        };

        await eventRequestService.update(request!.id, payload);
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

        await eventRequestService.create(payload);
      }

      navigation.navigate('AdminTabs', { screen: 'Request' });
    } catch (error: any) {
      Alert.alert(validationMessages.ERROR, error?.message || validationMessages.SOMETHING_WRONG);
    } finally {
      setSubmitting(false);
    }
  };

  const safeDateFromYmd = (ymd?: string) => {
    if (!ymd) return new Date();
    const [y, m, d] = ymd.split('-').map(Number);
    return y && m && d ? new Date(y, m - 1, d) : new Date();
  };

  return {
    isEdit,
    submitting,
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
    setEventName,
    setSportId,
    setGender,
    setFormat,
    setRequestedVenue,
    setLogisticsRequirements,
    genderOptions,
    formatOptions,
    isStartPickerVisible,
    isEndPickerVisible,
    showStartPicker: () => setStartPickerVisible(true),
    hideStartPicker: () => setStartPickerVisible(false),
    showEndPicker: () => setEndPickerVisible(true),
    hideEndPicker: () => setEndPickerVisible(false),
    onConfirmStartDate: (d: Date) => {
      setStartDate(toYmd(d));
      setStartPickerVisible(false);
    },
    onConfirmEndDate: (d: Date) => {
      setEndDate(toYmd(d));
      setEndPickerVisible(false);
    },
    safeDateFromYmd,
    errors,
    onSubmit,
    onBack: () => navigation.goBack(),
  };
};