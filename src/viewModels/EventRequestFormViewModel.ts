import { useEffect, useMemo, useState } from 'react';
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
import { Alert } from 'react-native';
import { validationMessages } from '../constants/validationMessages';
import Config from 'react-native-config';

const { BASE_URL } = Config;

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

const toYmd = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(text || `HTTP ${res.status}`);
  }

  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export const useEventRequestFormViewModel = ({
  mode,
  request,
  navigation,
}: Params) => {
  const isEdit = mode === 'edit' && !!request;

  const [eventName, setEventName] = useState(isEdit ? request!.eventName : '');
  const [sportId, setSportId] = useState<number>(isEdit ? request!.sportId : 0);
  const [gender, setGender] = useState<GenderType>(
    isEdit ? request!.gender : GenderType.Male,
  );
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

  // Fetch sports (create mode only)
  useEffect(() => {
    if (isEdit) return;

    (async () => {
      try {
        setSportsLoading(true);
        const data = await api<Sport[]>('/Sports');
        setSports(data);
      } catch (e: any) {
        Alert.alert(validationMessages.ERROR, e?.message);
      } finally {
        setSportsLoading(false);
      }
    })();
  }, [isEdit]);

  const selectedSportName = useMemo(() => {
    if (isEdit) return request?.sportsName ?? '';
    return sports.find((s) => s.id === sportId)?.name ?? '';
  }, [isEdit, request?.sportsName, sports, sportId]);

  // No sport-based filtering anymore
  const genderOptions = useMemo(() => {
    return Object.values(GenderType).map((g) => ({
      value: g,
      disabled: false,
    }));
  }, []);

  const formatOptions = useMemo(() => {
    return Object.values(MatchFormat).map((f) => ({
      value: f,
      disabled: false,
    }));
  }, []);

  const validate = () => {
    const e: Errors = {};

    if (!eventName.trim()) {
      e.eventName = validationMessages.EVENTNAME_REQUIRED;
    }

    if (!isEdit && (!sportId || sportId <= 0)) {
      e.sportId = validationMessages.SPORT_REQUIRED;
    }

    if (!requestedVenue.trim()) {
      e.requestedVenue = validationMessages.VENUE_REQUIRED;
    }

    if (!startDate) {
      e.startDate = validationMessages.STARTDATE_REQUIRED;
    }

    if (!endDate) {
      e.endDate = validationMessages.ENDDATE_REQUIRED;
    }

    if (startDate && endDate && startDate > endDate) {
      e.endDate = validationMessages.DATE_COMPARE;
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;

    try {
      setSubmitting(true);

      if (isEdit) {
        const dto: EditEventRequest = {
          eventName: eventName.trim(),
          requestedVenue: requestedVenue.trim(),
          logisticsRequirements: logisticsRequirements.trim(),
          format,
          gender,
          startDate,
          endDate,
        };

        const updated = await api<EventRequestResponse>(
          `/EventRequests/${request!.id}`,
          {
            method: 'PUT',
            body: JSON.stringify(dto),
          },
        );

        navigation.navigate('AdminTabs', { screen: 'Request' });
        return updated;
      }

      const dto: CreateEventRequest = {
        eventName: eventName.trim(),
        sportId,
        requestedVenue: requestedVenue.trim(),
        logisticsRequirements: logisticsRequirements.trim(),
        format,
        gender,
        startDate,
        endDate,
      };

      const created = await api<EventRequestResponse>('/EventRequests', {
        method: 'POST',
        body: JSON.stringify(dto),
      });

      navigation.navigate('AdminTabs', { screen: 'Request' });
      return created;
    } catch (e: any) {
      const message = e?.message || validationMessages.SOMETHING_WRONG;
      Alert.alert(validationMessages.ERROR, message);
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