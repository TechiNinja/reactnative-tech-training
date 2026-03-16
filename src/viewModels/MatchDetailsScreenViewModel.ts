import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FixtureResponse, MatchSetResponse } from '../models/ApiResponses';
import { getMatchById, getMatchSets, updateSetScore, updateSetById } from '../services/matchService';
import { bulkScheduleFixtures } from '../services/categoryService';
import { APP_STRINGS } from '../constants/AppStrings';

type MatchDetailsRouteProp = RouteProp<RootStackParamList, 'MatchDetails'>;

export const useMatchDetailsViewModel = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<MatchDetailsRouteProp>();
  const { matchId, role, eventStartDate, eventEndDate, eventVenue, categoryId, openSchedule } = route.params;

  const isOrganizer  = role === 'admin' || role === 'organizer';
  const isParticipant = role === 'participant';

  const [match, setMatch] = useState<FixtureResponse | null>(null);
  const [sets, setSets] = useState<MatchSetResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showScheduleModal, setShowScheduleModal] = useState(openSchedule ?? false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [totalSets, setTotalSetsState] = useState(1);
  const [scheduleError, setScheduleError] = useState('');

  const [tempScoreA, setTempScoreA] = useState(0);
  const [tempScoreB, setTempScoreB] = useState(0);
  const [editingSetId, setEditingSetId] = useState<number | null>(null);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchMatch = useCallback(async () => {
    try {
      const [m, s] = await Promise.all([getMatchById(matchId), getMatchSets(matchId)]);
      setMatch(m ?? null);
      setSets(s ?? []);
      if (m?.totalSets) setTotalSetsState(m.totalSets % 2 === 0 ? m.totalSets + 1 : m.totalSets);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => { fetchMatch(); }, [fetchMatch]);

  useEffect(() => {
    if (match?.status?.toUpperCase() === 'LIVE') {
      pollingRef.current = setInterval(() => { fetchMatch(); }, 5000);
    } else {
      if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
    }
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [match?.status, fetchMatch]);

  const setTotalSets = (updater: number | ((prev: number) => number)) => {
    setTotalSetsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (next < 1) return 1;
      if (next % 2 === 0) return next < prev ? next - 1 : next + 1;
      return next;
    });
  };

  const formatDateTime = (dt: string | Date | null | undefined): string | null => {
    if (!dt) return null;
    const date = typeof dt === 'string' ? new Date(dt) : dt;
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = (hours % 12 || 12).toString().padStart(2, '0');
    return `${day}/${month}/${year}, ${displayHours}:${minutes} ${ampm}`;
  };

  const formatDateTimeFromUTC = (dt: string | null | undefined): string | null => {
    if (!dt) return null;
    const date = new Date(dt);
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(date.getTime() + istOffset);
    const day = istDate.getUTCDate().toString().padStart(2, '0');
    const month = (istDate.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = istDate.getUTCFullYear();
    const hours = istDate.getUTCHours();
    const minutes = istDate.getUTCMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = (hours % 12 || 12).toString().padStart(2, '0');
    return `${day}/${month}/${year}, ${displayHours}:${minutes} ${ampm}`;
  };

  const validateSchedule = (): boolean => {
    const start = new Date(eventStartDate);
    const end   = new Date(eventEndDate);
    end.setHours(23, 59, 59);
    if (selectedDate < start || selectedDate > end) {
      setScheduleError(APP_STRINGS.matchScreen.scheduleDateRange(
        formatDateTime(start) ?? '',
        formatDateTime(end)   ?? '',
      ));
      return false;
    }
    if (totalSets < 1 || totalSets > 9) {
      setScheduleError(APP_STRINGS.matchScreen.invalidTotalSets);
      return false;
    }
    setScheduleError('');
    return true;
  };

  const handleSaveSchedule = async () => {
    if (!validateSchedule()) return;
    try {
      setSaving(true);
      const istOffset = 5.5 * 60 * 60 * 1000;
      const utcDate   = new Date(selectedDate.getTime() - istOffset);
      await bulkScheduleFixtures(categoryId, [{
        matchId,
        matchDateTime: utcDate.toISOString(),
        totalSets,
      }]);
      setShowScheduleModal(false);
      await fetchMatch();
    } catch (e: any) {
      const msg = e?.message ?? APP_STRINGS.matchScreen.failedToScheduleMatch;
      if (msg.includes('overlap') || msg.includes('conflict') || msg.includes('409')) {
        setScheduleError(APP_STRINGS.matchScreen.scheduleConflict);
      } else {
        setScheduleError(msg);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleStartMatch = async () => {
    try {
      setSaving(true);
      const result = await updateSetScore(matchId, { scoreA: 0, scoreB: 0, isCompleted: false });
      setSets((prev) => {
        const idx = prev.findIndex((s) => s.id === result?.set?.id);
        if (idx >= 0) { const updated = [...prev]; updated[idx] = result.set; return updated; }
        return [...prev, result.set];
      });
      await fetchMatch();
    } catch (e: any) {
      const msg = e?.message ?? APP_STRINGS.matchScreen.failedToStartMatch;
      if (msg.includes('Previous round')) {
        Alert.alert(APP_STRINGS.matchScreen.cannotStartMatch, APP_STRINGS.matchScreen.cannotStartMatchDesc);
      } else {
        Alert.alert(APP_STRINGS.matchScreen.error, msg);
      }
    } finally {
      setSaving(false);
    }
  };

  const isMatchLive      = match?.status?.toUpperCase() === 'LIVE';
  const isMatchCompleted = match?.status?.toUpperCase() === 'COMPLETED';
  const isMatchUpcoming  = match?.status?.toUpperCase() === 'UPCOMING';
  const canEditScore     = isOrganizer && isMatchLive;

  const activeSet       = sets.find((s) => s.status === 'Live') ?? null;
  const completedSets   = sets.filter((s) => s.status === 'Completed');

  const currentSetNumber = activeSet
    ? activeSet.setNumber
    : completedSets.length < (match?.totalSets ?? 0)
    ? completedSets.length + 1
    : null;

  useEffect(() => {
    if (editingSetId !== null) return;
    if (activeSet) {
      setTempScoreA(activeSet.scoreA);
      setTempScoreB(activeSet.scoreB);
    } else {
      setTempScoreA(0);
      setTempScoreB(0);
    }
  }, [activeSet?.id, editingSetId]);

  const handleEditCompletedSet = (set: MatchSetResponse) => {
    setEditingSetId(set.id);
    setTempScoreA(set.scoreA);
    setTempScoreB(set.scoreB);
  };

  const handleCancelEditSet = () => {
    setEditingSetId(null);
    if (activeSet) {
      setTempScoreA(activeSet.scoreA);
      setTempScoreB(activeSet.scoreB);
    } else {
      setTempScoreA(0);
      setTempScoreB(0);
    }
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
      } else {
        const result = await updateSetScore(matchId, {
          scoreA: tempScoreA,
          scoreB: tempScoreB,
          isCompleted,
        });
        setSets((prev) => {
          const idx = prev.findIndex((s) => s.id === result?.set?.id);
          if (idx >= 0) { const updated = [...prev]; updated[idx] = result.set; return updated; }
          return [...prev, result.set];
        });
        if (result.result) { await fetchMatch(); }
      }
    } catch (e: any) {
      Alert.alert(APP_STRINGS.matchScreen.error, e?.message ?? APP_STRINGS.matchScreen.failedToSaveScore);
    } finally {
      setSaving(false);
    }
  };

  const incrementScore = (team: 'A' | 'B') => {
    if (team === 'A') setTempScoreA((prev) => prev + 1);
    else setTempScoreB((prev) => prev + 1);
  };

  const decrementScore = (team: 'A' | 'B') => {
    if (team === 'A') setTempScoreA((prev) => Math.max(0, prev - 1));
    else setTempScoreB((prev) => Math.max(0, prev - 1));
  };

  const canCompleteSet = tempScoreA !== tempScoreB;

  return {
    match,
    sets,
    loading,
    saving,
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
    handleStartMatch,
    handleSaveScore,
    handleEditCompletedSet,
    handleCancelEditSet,
    incrementScore,
    decrementScore,
    navigation,
    formatDateTime,
    formatDateTimeFromUTC,
  };
};