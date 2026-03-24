import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Alert, AppState, AppStateStatus } from 'react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FormatType, FixtureTabType } from '../models/Event';
import { useAuthStore } from '../store/AuthStore';
import { APP_STRINGS } from '../constants/appStrings';
import { FixtureResponse, CategoryResponse } from '../models/ApiResponses';
import {
  getCategoryById,
  generateFixtures,
  getFixtures,
  getParticipantsByCategory,
} from '../services/categoryService';
import { updateSetScore, rescheduleMatch } from '../services/matchService';
import { OrganizerService, ApiTeamResponse } from '../services/organizerService';
import {
  clamp,
  daysInMonth,
  safeParse,
  toLocalISO,
  to24Hour,
  prefillDateFields,
  shiftDateByDelta,
} from '../utils/dateHelpers';

type CategoryDetailsRouteProp = RouteProp<RootStackParamList, 'CategoryDetails'>;
type Participant = { id: string; name: string };
type ApiTeam = { id: string; name: string; members: string[] };

const LIVE_POLL_MS = 4000;

export const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export const useCategoryDetailsScreenViewModel = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<CategoryDetailsRouteProp>();
  const {
    eventId, gender, format: eventFormat, role,
    eventCategoryId, eventStartDate, eventEndDate, eventVenue,
  } = route.params;
  const { user } = useAuthStore();

  const [category, setCategory] = useState<CategoryResponse | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [teams, setTeams] = useState<ApiTeam[]>([]);
  const [fixtures, setFixtures] = useState<FixtureResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState('');
  const [activeFixtureTab, setActiveFixtureTab] = useState<FixtureTabType>(FixtureTabType.ALL);
  const [searchQuery, setSearchQuery] = useState('');

  const [goLiveFixture, setGoLiveFixture] = useState<FixtureResponse | null>(null);
  const [goLiveTotalSets, setGoLiveTotalSets] = useState(1);
  const [goLiveLoading, setGoLiveLoading] = useState(false);

  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleFixture, setRescheduleFixture] = useState<FixtureResponse | null>(null);
  const [rescheduleStep, setRescheduleStep] = useState<'select' | 'datetime'>('select');

  const [rDay, setRDay] = useState(1);
  const [rMonth, setRMonth] = useState(0);
  const [rYear, setRYear] = useState(new Date().getFullYear());
  const [rHour12, setRHour12] = useState(12);
  const [rMinute, setRMinute] = useState(0);
  const [rAmPm, setRAmPm] = useState<'AM' | 'PM'>('AM');

  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [rescheduleError, setRescheduleError] = useState('');

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const rHour24 = useMemo(() => to24Hour(rHour12, rAmPm), [rHour12, rAmPm]);

  const rDate = useMemo(
    () => new Date(rYear, rMonth, rDay, rHour24, rMinute, 0),
    [rYear, rMonth, rDay, rHour24, rMinute],
  );

  const rLocalISO = useMemo(() => toLocalISO(rDate), [rDate]);

  const adjustDay = (delta: number) =>
    setRDay((p) => clamp(p + delta, 1, daysInMonth(rMonth, rYear)));

  const adjustMonth = (delta: number) =>
    setRMonth((p) => { const n = p + delta; return n < 0 ? 11 : n > 11 ? 0 : n; });

  const adjustYear = (delta: number) => {
    const min = safeParse(eventStartDate)?.getFullYear() ?? new Date().getFullYear();
    const max = safeParse(eventEndDate)?.getFullYear() ?? new Date().getFullYear() + 5;
    setRYear((p) => clamp(p + delta, min, max));
  };

  const adjustHour = (delta: number) =>
    setRHour12((p) => { const n = p + delta; return n < 1 ? 12 : n > 12 ? 1 : n; });

  const adjustMinute = (delta: number) =>
    setRMinute((p) => { const n = p + delta; return n < 0 ? 55 : n > 59 ? 0 : n; });

  const toggleAmPm = () => setRAmPm((p) => (p === 'AM' ? 'PM' : 'AM'));

  const prefillFromDate = (d: Date) => {
    const fields = prefillDateFields(d);
    setRDay(fields.day);
    setRMonth(fields.month);
    setRYear(fields.year);
    setRHour12(fields.hour12);
    setRMinute(fields.minute);
    setRAmPm(fields.amPm);
  };

  const mainTabs = useMemo(() => {
    const tabs: string[] = [];
    if (role !== 'participant') tabs.push('PARTICIPANTS');
    if (eventFormat === FormatType.Doubles) tabs.push('TEAMS');
    tabs.push('FIXTURES');
    return tabs;
  }, [role, eventFormat]);

  const isAdminOrOrganizer = role === 'admin' || role === 'organizer';
  const canManageEvent = role === 'admin' || role === 'organizer';
  const isAbandoned = category?.status === 'Abandoned';
  const canCreateTeams = eventFormat === FormatType.Doubles && participants.length >= 4 && !isAbandoned;
  const canCreateFixtures = participants.length >= 2;

  const hasAnyLive = useMemo(
    () => fixtures.some((f) => f.status.toUpperCase() === 'LIVE'),
    [fixtures],
  );

  const hasAnyLiveOrCompleted = useMemo(
    () => fixtures.some((f) =>
      f.status.toUpperCase() === 'LIVE' || f.status.toUpperCase() === 'COMPLETED'),
    [fixtures],
  );

  const upcomingFixtures = useMemo(
    () => fixtures.filter((f) => f.status.toUpperCase() === 'UPCOMING' && !f.isBye),
    [fixtures],
  );

  const loadData = useCallback(async (silent = false) => {
    if (!eventCategoryId) return;
    try {
      if (!silent) setLoading(true);
      const [cat, parts, fixtureList] = await Promise.all([
        getCategoryById(eventCategoryId),
        getParticipantsByCategory(eventCategoryId),
        getFixtures(eventCategoryId),
      ]);
      setCategory(cat ?? null);
      setParticipants((parts ?? []).map((p) => ({ id: String(p.id), name: p.name })));
      setFixtures(fixtureList ?? []);
      if (eventFormat === FormatType.Doubles) {
        const apiTeams = await OrganizerService.getTeams(eventCategoryId);
        setTeams((apiTeams ?? []).map((t: ApiTeamResponse) => ({
          id: String(t.id), name: t.name, members: t.members ?? [],
        })));
      }
    } catch {
      Alert.alert(APP_STRINGS.common.error, APP_STRINGS.eventScreen.failedToLoad);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [eventCategoryId, eventFormat]);

  const refreshFixtures = useCallback(async () => {
  if (!eventCategoryId) return;
  try {
    const list = await getFixtures(eventCategoryId);
    setFixtures(list ?? []);
  } catch (err) {
    console.error(APP_STRINGS.goLiveModal.livePollFailed, err);
  }
}, [eventCategoryId]);

  useEffect(() => { loadData(); }, [loadData]);
  useFocusEffect(useCallback(() => { loadData(true); }, [loadData]));

  useEffect(() => {
    const start = () => {
      if (pollingRef.current) return;
      pollingRef.current = setInterval(refreshFixtures, LIVE_POLL_MS);
    };
    const stop = () => {
      if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
    };
    if (hasAnyLive) {
      if (appStateRef.current === 'active') start();
      const sub = AppState.addEventListener('change', (s: AppStateStatus) => {
        appStateRef.current = s;
        s === 'active' ? start() : stop();
      });
      return () => { stop(); sub.remove(); };
    } else { stop(); }
  }, [hasAnyLive, refreshFixtures]);

  useEffect(() => {
    if (activeMainTab === '' && mainTabs.length > 0) setActiveMainTab(mainTabs[0]);
  }, [mainTabs, activeMainTab]);

  const handleRefresh = useCallback(() => { setRefreshing(true); loadData(true); }, [loadData]);

  const filteredTeams = useMemo(
    () => searchQuery.trim()
      ? teams.filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : teams,
    [teams, searchQuery],
  );

  const filteredFixtures = useMemo(() => {
    let result = fixtures;
    if (activeFixtureTab !== FixtureTabType.ALL)
      result = result.filter((f) => f.status.toUpperCase() === activeFixtureTab);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) => f.sideAName?.toLowerCase().includes(q) || f.sideBName?.toLowerCase().includes(q),
      );
    }
    return result;
  }, [fixtures, activeFixtureTab, searchQuery]);

  const visibleFixtures = useMemo(
    () => canManageEvent
      ? filteredFixtures
      : filteredFixtures.filter((f) => !(f.sideAName === 'BYE' && f.sideBName === 'BYE')),
    [canManageEvent, filteredFixtures],
  );

  const getRoundName = (roundNumber: number, matchNumber: number) => {
    const maxRound = fixtures.length > 0 ? Math.max(...fixtures.map((f) => f.roundNumber)) : 1;
    const roundMatches = fixtures.filter((f) => f.roundNumber === roundNumber);
    if (roundNumber === maxRound && roundMatches.length === 1) return APP_STRINGS.eventScreen.final;
    if (roundNumber === maxRound - 1 && roundMatches.length === 2) return APP_STRINGS.eventScreen.semiFinal;
    if (roundNumber === maxRound - 2 && roundMatches.length === 4) return APP_STRINGS.eventScreen.quarterFinal;
    const idx = roundMatches
      .sort((a, b) => a.matchNumber - b.matchNumber)
      .findIndex((f) => f.matchNumber === matchNumber);
    return APP_STRINGS.fixtureScreen.matchPrefix + (idx + 1);
  };

  const handleCreateTeams = async () => {
    if (!eventCategoryId) return;
    if (participants.length < 4) { Alert.alert(APP_STRINGS.goLiveModal.minimumParticipants(4)); return; }
    try {
      const apiTeams = await OrganizerService.createTeams(eventCategoryId);
      setTeams((apiTeams ?? []).map((t: ApiTeamResponse) => ({
        id: String(t.id), name: t.name, members: t.members ?? [],
      })));
      setFixtures((await generateFixtures(eventCategoryId)) ?? []);
      Alert.alert(APP_STRINGS.common.success, APP_STRINGS.goLiveModal.teamsAndFixturesCreated);
    } catch (e: any) {
      Alert.alert(APP_STRINGS.eventScreen.createTeam, e?.message ?? APP_STRINGS.eventScreen.teamCreationFailed);
    }
  };

  const handleCreateFixtures = async () => {
    if (!eventCategoryId) return;
    if (isAbandoned) {
      Alert.alert(APP_STRINGS.eventScreen.categoryAbandoned, APP_STRINGS.eventScreen.categoryAbandonedDescription);
      return;
    }
    try {
      setFixtures((await generateFixtures(eventCategoryId)) ?? []);
    } catch (e: any) {
      Alert.alert(APP_STRINGS.eventScreen.createFixtures, e?.message ?? APP_STRINGS.eventScreen.fixtureNotCreated);
    }
  };

  const handleFixturePress = (fixture: FixtureResponse) => {
    if (fixture.status?.toUpperCase() === 'UPCOMING' && canManageEvent) {
      setGoLiveFixture(fixture);
      setGoLiveTotalSets(1);
    } else {
      navigation.navigate('MatchDetails', {
        matchId: fixture.id, role,
        eventStartDate, eventEndDate, eventVenue,
        categoryId: eventCategoryId ?? 0,
      });
    }
  };

  const handleCloseGoLiveModal = () => setGoLiveFixture(null);

  const adjustGoLiveSets = (delta: number) =>
    setGoLiveTotalSets((p) => {
      let n = p + delta;
      if (n < 1) n = 1;
      if (n % 2 === 0) n += delta > 0 ? 1 : -1;
      if (n < 1) n = 1;
      return n;
    });

  const handleConfirmGoLive = async () => {
    if (!goLiveFixture || !eventCategoryId) return;
    try {
      setGoLiveLoading(true);
      await updateSetScore(goLiveFixture.id, { scoreA: 0, scoreB: 0, isCompleted: false, totalSets: goLiveTotalSets });
      setGoLiveFixture(null);
      navigation.navigate('MatchDetails', {
        matchId: goLiveFixture.id, role,
        eventStartDate, eventEndDate, eventVenue, categoryId: eventCategoryId,
      });
    } catch (e: any) {
      Alert.alert(APP_STRINGS.matchScreen.cannotStartMatch, e?.message ?? APP_STRINGS.goLiveModal.failedToGoLive);
    } finally { setGoLiveLoading(false); }
  };

  const handleOpenReschedule = () => {
    setRescheduleFixture(null);
    setRescheduleStep('select');
    setRescheduleError('');
    setShowRescheduleModal(true);
  };

  const handleCloseReschedule = () => {
    setShowRescheduleModal(false);
    setRescheduleFixture(null);
    setRescheduleStep('select');
    setRescheduleError('');
  };

  const handleSelectRescheduleFixture = (fixture: FixtureResponse) => {
    setRescheduleFixture(fixture);
    prefillFromDate(safeParse(fixture.matchDateTime) ?? new Date());
    setRescheduleStep('datetime');
  };

  const handleBackToSelect = () => {
    setRescheduleStep('select');
    setRescheduleFixture(null);
    setRescheduleError('');
  };

  const handleConfirmReschedule = async () => {
    if (!rescheduleFixture) return;
    setRescheduleError('');

    const oldDate = safeParse(rescheduleFixture.matchDateTime);
    const deltaMs = oldDate ? rDate.getTime() - oldDate.getTime() : 0;

    const sorted = [...upcomingFixtures].sort((a, b) =>
      (safeParse(a.matchDateTime ?? '')?.getTime() ?? 0) -
      (safeParse(b.matchDateTime ?? '')?.getTime() ?? 0),
    );

    const idx = sorted.findIndex((f) => f.id === rescheduleFixture.id);
    const toUpdate = sorted.slice(idx);

    try {
      setRescheduleLoading(true);
      for (let i = 0; i < toUpdate.length; i++) {
        const f = toUpdate[i];
        const iso = i === 0 ? rLocalISO : shiftDateByDelta(f.matchDateTime, deltaMs, rDate);
        await rescheduleMatch(f.id, iso);
      }
      await loadData(true);
      handleCloseReschedule();
      Alert.alert(
        APP_STRINGS.common.success,
        toUpdate.length > 1
          ? `${toUpdate.length} ${APP_STRINGS.rescheduleModal.success}`
          : APP_STRINGS.rescheduleModal.success,
      );
    } catch (e: any) {
      setRescheduleError(e?.message ?? APP_STRINGS.rescheduleModal.failed);
    } finally {
      setRescheduleLoading(false);
    }
  };

  return {
    category, loading, refreshing, gender,
    format: eventFormat,
    role, navigation,
    mainTabs, activeMainTab, setActiveMainTab,
    activeFixtureTab, setActiveFixtureTab,
    searchQuery, setSearchQuery,
    participants, teams: filteredTeams, fixtures,
    isAdminOrOrganizer, canManageEvent, isAbandoned,
    filteredFixtures: visibleFixtures,
    canCreateTeams, canCreateFixtures,
    hasAnyLiveOrCompleted,
    minRequiredForTeams: 4,
    hasTeamsForGender: teams.length > 0,
    hasFixturesForGender: fixtures.length > 0,
    getRoundName,
    handleCreateTeams, handleCreateFixtures, handleFixturePress,
    goLiveFixture, goLiveTotalSets, goLiveLoading,
    handleCloseGoLiveModal, adjustGoLiveSets, handleConfirmGoLive,
    handleRefresh,
    eventVenue, eventStartDate, eventEndDate, eventCategoryId,
    eventName: category?.eventName ?? '',
    event: category ? { sport: category.eventName ?? '' } : null,
    showRescheduleModal, rescheduleFixture, rescheduleStep,
    rDay, rMonth, rYear, rHour12, rMinute, rAmPm,
    adjustDay, adjustMonth, adjustYear, adjustHour, adjustMinute, toggleAmPm,
    rLocalISO,
    rescheduleLoading, rescheduleError,
    upcomingFixtures,
    handleOpenReschedule, handleCloseReschedule,
    handleSelectRescheduleFixture,
    handleBackToSelect, handleConfirmReschedule,
    MONTHS,
  };
};