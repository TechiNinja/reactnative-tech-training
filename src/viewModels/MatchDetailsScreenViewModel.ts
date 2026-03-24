import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert, AppState, AppStateStatus } from 'react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FixtureResponse, MatchSetResponse } from '../models/ApiResponses';
import { getMatchById, getMatchSets, updateSetScore, updateSetById } from '../services/matchService';
import { bulkScheduleFixtures } from '../services/categoryService';
import { APP_STRINGS } from '../constants/appStrings';
import { formatDisplayDateTime } from '../utils/dateUtils';

type MatchDetailsRouteProp = RouteProp<RootStackParamList, 'MatchDetails'>;

const LIVE_POLL_INTERVAL_MS = 5000;

export const useMatchDetailsScreenViewModel = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<MatchDetailsRouteProp>();
  const { matchId, role, eventStartDate, eventEndDate, eventVenue, categoryId, openSchedule } = route.params;

  const isOrganizer   = role === 'admin' || role === 'organizer';
  const isParticipant = role === 'participant';

  const [match, setMatch] = useState<FixtureResponse | null>(null);
  const [sets, setSets] = useState<MatchSetResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showScheduleModal, setShowScheduleModal] = useState(openSchedule ?? false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [totalSets, setTotalSetsState] = useState(1);
  const [scheduleError, setScheduleError] = useState('');

  const [tempScoreA, setTempScoreA] = useState(0);
  const [tempScoreB, setTempScoreB] = useState(0);
  const [editingSetId, setEditingSetId] = useState<number | null>(null);

  const initializedSetId = useRef<number | null>(null);
  const scoresDirty      = useRef(false);
  const pollingRef       = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateRef      = useRef<AppStateStatus>(AppState.currentState);

  const fetchMatchFull = useCallback(async () => {
    try {
      setError(null);
      const [m, s] = await Promise.all([getMatchById(matchId), getMatchSets(matchId)]);
      setMatch(m ?? null);
      setSets(s ?? []);
      if (m?.totalSets) setTotalSetsState(m.totalSets % 2 === 0 ? m.totalSets + 1 : m.totalSets);
    } catch (e: any) {
      setError(e?.message ?? APP_STRINGS.matchScreen.matchNotFound);
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  const fetchMatchSilent = useCallback(async () => {
    try {
      const [m, s] = await Promise.all([getMatchById(matchId), getMatchSets(matchId)]);
      setMatch(m ?? null);
      if (!scoresDirty.current) {
        setSets(s ?? []);
      }
    } catch {}
  }, [matchId]);

  const handleRetry = useCallback(() => { setLoading(true); fetchMatchFull(); }, [fetchMatchFull]);
  const handleBack  = useCallback(() => navigation.goBack(), [navigation]);

  useEffect(() => { fetchMatchFull(); }, [fetchMatchFull]);

  useFocusEffect(
    useCallback(() => {
      if (!scoresDirty.current) {
        fetchMatchFull();
      } else {
        fetchMatchSilent();
      }
    }, [fetchMatchFull, fetchMatchSilent]),
  );

  useEffect(() => {
    const isLive = match?.status?.toUpperCase() === 'LIVE';
    const startPolling = () => {
      if (pollingRef.current) return;
      if (isOrganizer) return;
      pollingRef.current = setInterval(() => { fetchMatchSilent(); }, LIVE_POLL_INTERVAL_MS);
    };
    const stopPolling = () => {
      if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
    };
    if (isLive) {
      if (appStateRef.current === 'active') startPolling();
      const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
        appStateRef.current = nextState;
        if (nextState === 'active') startPolling();
        else stopPolling();
      });
      return () => { stopPolling(); subscription.remove(); };
    } else {
      stopPolling();
    }
  }, [match?.status, fetchMatchSilent, isOrganizer]);

  const setTotalSets = (updater: number | ((prev: number) => number)) => {
    setTotalSetsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (next < 1) return 1;
      if (next % 2 === 0) return next < prev ? next - 1 : next + 1;
      return next;
    });
  };

  const validateSchedule = (): boolean => {
    const start = new Date(eventStartDate);
    const end   = new Date(eventEndDate);
    end.setHours(23, 59, 59);
    if (selectedDate < start || selectedDate > end) {
      setScheduleError(APP_STRINGS.matchScreen.scheduleDateRange(
        formatDisplayDateTime(start),
        formatDisplayDateTime(end),
      ));
      return false;
    }
    setScheduleError('');
    return true;
  };

  const handleSaveSchedule = async () => {
    if (!validateSchedule()) return;
    try {
      setSaving(true);
      await bulkScheduleFixtures(categoryId, [{
        matchId,
        matchDateTime: selectedDate.toISOString(),
        totalSets,
      }]);
      setShowScheduleModal(false);
      await fetchMatchFull();
    } catch (e: any) {
      setScheduleError(e?.message ?? APP_STRINGS.matchScreen.failedToScheduleMatch);
    } finally {
      setSaving(false);
    }
  };

  const isMatchLive      = match?.status?.toUpperCase() === 'LIVE';
  const isMatchCompleted = match?.status?.toUpperCase() === 'COMPLETED';
  const isMatchUpcoming  = match?.status?.toUpperCase() === 'UPCOMING';
  const canEditScore     = isOrganizer && isMatchLive;

  const activeSet     = sets.find((s) => s.status === 'Live') ?? null;
  const completedSets = sets.filter((s) => s.status === 'Completed');

  const currentSetNumber = activeSet
    ? activeSet.setNumber
    : completedSets.length < (match?.totalSets ?? 0)
    ? completedSets.length + 1
    : null;

  useEffect(() => {
    if (editingSetId !== null) return;
    const newId = activeSet?.id ?? null;
    if (newId !== initializedSetId.current) {
      initializedSetId.current = newId;
      scoresDirty.current = false;
      setTempScoreA(activeSet?.scoreA ?? 0);
      setTempScoreB(activeSet?.scoreB ?? 0);
    }
  }, [activeSet?.id, editingSetId]);

  const handleEditCompletedSet = (set: MatchSetResponse) => {
    setEditingSetId(set.id);
    setTempScoreA(set.scoreA);
    setTempScoreB(set.scoreB);
  };

  const handleCancelEditSet = () => {
    setEditingSetId(null);
    scoresDirty.current = false;
    setTempScoreA(activeSet?.scoreA ?? 0);
    setTempScoreB(activeSet?.scoreB ?? 0);
  };

  const handleSaveScore = async (isCompleted: boolean) => {
    if (!canEditScore) return;
    try {
      setSaving(true);
      if (editingSetId !== null) {
        const result = await updateSetById(matchId, editingSetId, {
          scoreA: tempScoreA,
          scoreB: tempScoreB,
          isCompleted: true,
        });
        setSets((prev) => {
          const idx = prev.findIndex((s) => s.id === result?.set?.id);
          if (idx >= 0) { const updated = [...prev]; updated[idx] = result.set; return updated; }
          return prev;
        });
        setEditingSetId(null);
        scoresDirty.current = false;
      } else {
        const result = await updateSetScore(matchId, {
          scoreA: tempScoreA,
          scoreB: tempScoreB,
          isCompleted,
        });

        setSets((prev) => {
          const idx = prev.findIndex((s) => s.id === result?.set?.id);
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = result.set;
            return updated;
          }
          return [...prev, result.set];
        });

        if (isCompleted) {
          scoresDirty.current = false;
          await fetchMatchFull();
        }

        if (result.result) { await fetchMatchFull(); }
      }
    } catch (e: any) {
      Alert.alert(APP_STRINGS.matchScreen.error, e?.message ?? APP_STRINGS.matchScreen.failedToSaveScore);
    } finally {
      setSaving(false);
    }
  };

  const incrementScore = (team: 'A' | 'B') => {
    scoresDirty.current = true;
    if (team === 'A') setTempScoreA((prev) => prev + 1);
    else setTempScoreB((prev) => prev + 1);
  };

  const decrementScore = (team: 'A' | 'B') => {
    scoresDirty.current = true;
    if (team === 'A') setTempScoreA((prev) => Math.max(0, prev - 1));
    else setTempScoreB((prev) => Math.max(0, prev - 1));
  };

  const canCompleteSet = tempScoreA !== tempScoreB;

  return {
    match,
    sets,
    loading,
    saving,
    error,
    handleRetry,
    handleBack,
    isOrganizer,
    isParticipant,
    eventStartDate,
    eventEndDate,
    eventVenue,
    isMatchLive,
    isMatchCompleted,
    isMatchUpcoming,
    canEditScore,
    activeSet,
    completedSets,
    currentSetNumber,
    editingSetId,
    tempScoreA,
    tempScoreB,
    canCompleteSet,
    showScheduleModal,
    setShowScheduleModal,
    showDatePicker,
    setShowDatePicker,
    showTimePicker,
    setShowTimePicker,
    selectedDate,
    setSelectedDate,
    totalSets,
    setTotalSets,
    scheduleError,
    handleSaveSchedule,
    handleSaveScore,
    handleEditCompletedSet,
    handleCancelEditSet,
    incrementScore,
    decrementScore,
  };
};