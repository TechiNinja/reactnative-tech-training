import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FormatType, GenderType, FixtureTabType } from '../models/Event';
import { useAuthStore } from '../store/AuthStore';
import { APP_STRINGS } from '../constants/AppStrings';
import { FixtureResponse, CategoryResponse } from '../models/ApiResponses';
import {
  getCategoryById,
  generateFixtures,
  getFixtures,
  deleteFixtures,
  getParticipantsByCategory,
} from '../services/categoryService';
import { OrganizerService } from '../services/organizerService';

type CategoryDetailsRouteProp = RouteProp<RootStackParamList, 'CategoryDetails'>;
type Participant = { id: string; name: string };
type ApiTeam = { id: string; name: string; members: string[] };

export const useCategoryDetailsViewModel = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<CategoryDetailsRouteProp>();
  const { eventId, gender, format, role, eventCategoryId, eventStartDate, eventEndDate, eventVenue } = route.params;
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

  const mainTabs = (() => {
    const tabs: string[] = [];
    if (role !== 'participant') tabs.push('PARTICIPANTS');
    if (format === FormatType.Doubles) tabs.push('TEAMS');
    tabs.push('FIXTURES');
    return tabs;
  })();

  const isAdminOrOrganizer = role === 'admin' || role === 'organizer';
  const canManageEvent = role === 'admin' || role === 'organizer';
  const isAbandoned = category?.status === 'Abandoned';
  const canCreateTeams = format === FormatType.Doubles && participants.length >= 2 && !isAbandoned;
  const canCreateFixtures = participants.length >= 2;

  const hasAnyLiveOrCompleted = fixtures.some(
    (f) => f.status.toUpperCase() === 'LIVE' || f.status.toUpperCase() === 'COMPLETED',
  );

  const canRegenerate = canManageEvent && fixtures.length > 0 && !hasAnyLiveOrCompleted;

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
      if (format === FormatType.Doubles) {
        const apiTeams = await OrganizerService.getTeams(eventCategoryId);
        setTeams((apiTeams ?? []).map((t: any) => ({
          id: String(t.id),
          name: t.name,
          members: t.members ?? [],
        })));
      }
    } catch {
      Alert.alert(APP_STRINGS.fixtureScreen.error, APP_STRINGS.participantScreens.failedToLoadData);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [eventCategoryId, format]);

  useEffect(() => { loadData(); }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      loadData(true);
    }, [loadData]),
  );

  useEffect(() => {
    if (activeMainTab === '' && mainTabs.length > 0) setActiveMainTab(mainTabs[0]);
  }, [mainTabs, activeMainTab]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadData(true);
  }, [loadData]);

  const filteredTeams = searchQuery.trim()
    ? teams.filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : teams;

  const filteredFixtures = (() => {
    let result = fixtures;
    if (activeFixtureTab !== FixtureTabType.ALL) {
      result = result.filter((f) => f.status.toUpperCase() === activeFixtureTab);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) => f.sideAName?.toLowerCase().includes(q) || f.sideBName?.toLowerCase().includes(q),
      );
    }
    return result;
  })();

  const visibleFixtures = (() => {
    if (canManageEvent) return filteredFixtures;
    return filteredFixtures.filter(
      (f) => !(f.sideAName === 'BYE' && f.sideBName === 'BYE'),
    );
  })();

  const getRoundName = (roundNumber: number, matchNumber: number) => {
    const maxRound = fixtures.length > 0
      ? Math.max(...fixtures.map((f) => f.roundNumber))
      : 1;

    const roundMatches = fixtures.filter((f) => f.roundNumber === roundNumber);
    const totalMatchesInRound = roundMatches.length;

    if (roundNumber === maxRound && totalMatchesInRound === 1) return APP_STRINGS.eventScreen.final;
    if (roundNumber === maxRound - 1 && totalMatchesInRound === 2) return APP_STRINGS.eventScreen.semiFinal;
    if (roundNumber === maxRound - 2 && totalMatchesInRound === 4) return APP_STRINGS.eventScreen.quarterFinal;

    const matchIndexInRound = roundMatches
      .sort((a, b) => a.matchNumber - b.matchNumber)
      .findIndex((f) => f.matchNumber === matchNumber);

    return APP_STRINGS.fixtureScreen.matchPrefix + (matchIndexInRound + 1);
  };

  const handleCreateTeams = async () => {
    if (!eventCategoryId) return;
    if (format === FormatType.Singles) { Alert.alert(APP_STRINGS.eventScreen.noTeamsRequired); return; }
    if (participants.length < 2) { Alert.alert(APP_STRINGS.eventScreen.noEnoughRegistrations); return; }
    try {
      const apiTeams = await OrganizerService.createTeams(eventCategoryId);
      setTeams((apiTeams ?? []).map((t) => ({ id: String(t.id), name: t.name, members: t.members ?? [] })));
    } catch {
      Alert.alert(APP_STRINGS.eventScreen.createTeam, APP_STRINGS.eventScreen.teamCreationFailed);
    }
  };

  const handleCreateFixtures = async () => {
    if (!eventCategoryId) return;
    if (isAbandoned) {
      Alert.alert(APP_STRINGS.eventScreen.categoryAbandoned, APP_STRINGS.eventScreen.categoryAbandonedDescription);
      return;
    }
    try {
      const generated = await generateFixtures(eventCategoryId);
      setFixtures(generated ?? []);
    } catch (e: any) {
      Alert.alert(APP_STRINGS.eventScreen.createFixtures, e?.message ?? APP_STRINGS.eventScreen.teamCreationFailed);
    }
  };

  const handleDeleteAndRegenerate = async () => {
    if (!eventCategoryId) return;
    if (hasAnyLiveOrCompleted) {
      Alert.alert(APP_STRINGS.fixtureScreen.cannotRegenerate, APP_STRINGS.fixtureScreen.cannotRegenerateDesc);
      return;
    }
    Alert.alert(APP_STRINGS.fixtureScreen.regenerateFixtures, APP_STRINGS.fixtureScreen.regenerateFixturesDesc, [
      { text: APP_STRINGS.buttons.cancel, style: 'cancel' },
      {
        text: APP_STRINGS.buttons.continue,
        onPress: async () => {
          try {
            await deleteFixtures(eventCategoryId);
            const generated = await generateFixtures(eventCategoryId);
            setFixtures(generated ?? []);
          } catch (e: any) {
            Alert.alert(APP_STRINGS.fixtureScreen.error, e?.message ?? APP_STRINGS.eventScreen.teamCreationFailed);
          }
        },
      },
    ]);
  };

  const handleDeleteFixture = async () => {
    if (hasAnyLiveOrCompleted) {
      Alert.alert(APP_STRINGS.fixtureScreen.cannotDelete, APP_STRINGS.fixtureScreen.cannotDeleteDesc);
      return;
    }
    Alert.alert(
      APP_STRINGS.fixtureScreen.deleteAllFixtures,
      APP_STRINGS.fixtureScreen.deleteAllFixturesDesc,
      [
        { text: APP_STRINGS.buttons.cancel, style: 'cancel' },
        {
          text: APP_STRINGS.buttons.deleteAll,
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteFixtures(eventCategoryId!);
              setFixtures([]);
            } catch (e: any) {
              Alert.alert(APP_STRINGS.fixtureScreen.error, e?.message ?? APP_STRINGS.fixtureScreen.failedToDeleteFixtures);
            }
          },
        },
      ],
    );
  };

  const handleFixturePress = (fixture: FixtureResponse) => {
    navigation.navigate('MatchDetails', {
      matchId: fixture.id,
      role,
      eventStartDate,
      eventEndDate,
      eventVenue,
      categoryId: eventCategoryId ?? 0,
    });
  };

  const handleScheduleFixture = (fixture: FixtureResponse) => {
    navigation.navigate('MatchDetails', {
      matchId: fixture.id,
      role,
      eventStartDate,
      eventEndDate,
      eventVenue,
      categoryId: eventCategoryId ?? 0,
      openSchedule: true,
    });
  };

  return {
    category,
    loading,
    refreshing,
    gender,
    format,
    role,
    navigation,
    mainTabs,
    activeMainTab,
    setActiveMainTab,
    activeFixtureTab,
    setActiveFixtureTab,
    searchQuery,
    setSearchQuery,
    participants,
    teams: filteredTeams,
    fixtures,
    isAdminOrOrganizer,
    canManageEvent,
    isAbandoned,
    filteredFixtures: visibleFixtures,
    canCreateTeams,
    canCreateFixtures,
    canRegenerate,
    hasAnyLiveOrCompleted,
    minRequiredForTeams: 2,
    hasTeamsForGender: teams.length > 0,
    hasFixturesForGender: fixtures.length > 0,
    handleDeleteFixture,
    getRoundName,
    handleCreateTeams,
    handleCreateFixtures,
    handleDeleteAndRegenerate,
    handleFixturePress,
    handleScheduleFixture,
    handleRefresh,
    eventVenue,
    eventName: category?.eventName ?? '',
    event: category ? { sport: category.eventName ?? '' } : null,
  };
};