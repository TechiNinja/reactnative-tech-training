import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useEventStore } from '../store/EventStore';
import { useAuthStore } from '../store/AuthStore';
import { APP_STRINGS } from '../constants/AppStrings';
import {
  EventStatus,
  Fixture,
  FixtureTabType,
  FormatType,
  GenderType,
  MatchStatus,
  Team,
} from '../models/Event';

type CategoryDetailsRouteProp = RouteProp<
  RootStackParamList,
  'CategoryDetails'
>;

const nextPowerOfTwo = (n: number) => Math.pow(2, Math.ceil(Math.log2(n)));
const generateFixtureId = () =>
  `fix-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const useCategoryDetailsViewModel = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<CategoryDetailsRouteProp>();
  const { eventId, gender, format, role } = route.params;

  const {
    events,
    updateEvent,
    updateFixtureScore,
    updateFixtureStatus,
    completeFixture,
  } = useEventStore();

  const { user } = useAuthStore();

  const event = events.find((event) => event.id === eventId) ?? null;

  const mainTabs = (() => {
    const tabs: string[] = [];
    if (role !== 'participant') {
      tabs.push('PARTICIPANTS');
    }
    if (format === FormatType.Doubles) tabs.push('TEAMS');
    tabs.push('FIXTURES');
    return tabs;
  })();

  const [activeMainTab, setActiveMainTab] = useState(mainTabs[0]);
  const [activeFixtureTab, setActiveFixtureTab] = useState<FixtureTabType>(
    FixtureTabType.ALL,
  );
  const [searchQuery, setSearchQuery] = useState('');

  const isAdminOrOrganizer = role === 'admin' || role === 'organizer';

  const canManageEvent =
    role === 'admin' ||
    (role === 'organizer' && event?.createdBy === user?.email);

  const isMixedCategory = gender === GenderType.Mixed;

  const participants = (() => {
    if (!event) return [];
    if (isMixedCategory) {
      return event.registrations.filter((player) =>
        player.formats?.includes(format),
      );
    }
    return event.registrations.filter(
      (player) => player.gender === gender && player.formats?.includes(format),
    );
  })();

  const teams = (() => {
    if (!event) return [];
    return event.teams.filter(
      (team) => team.gender === gender && team.format === format,
    );
  })();

  const filteredTeams = (() => {
    if (!searchQuery.trim()) return teams;
    return teams.filter((team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  })();

  const fixtures = (() => {
    if (!event) return [];
    if (isMixedCategory) {
      return event.fixtures.filter(
        (fixture) =>
          fixture.gender === GenderType.Mixed && fixture.format === format,
      );
    }
    return event.fixtures.filter(
      (fixture) => fixture.gender === gender && fixture.format === format,
    );
  })();

  const filteredFixtures = (() => {
    let result = fixtures;
    if (activeFixtureTab !== FixtureTabType.ALL) {
      result = result.filter(
        (fixture) =>
          fixture.status === (activeFixtureTab as unknown as MatchStatus),
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (fixture) =>
          fixture.teamA?.toLowerCase().includes(q) ||
          fixture.teamB?.toLowerCase().includes(q),
      );
    }
    return result;
  })();

  const getRoundName = (round: number, totalCount: number) => {
    const totalRounds = Math.log2(nextPowerOfTwo(totalCount));
    if (round === totalRounds) return APP_STRINGS.eventScreen.final;
    if (round === totalRounds - 1) return APP_STRINGS.eventScreen.semiFinal;
    if (round === totalRounds - 2) return APP_STRINGS.eventScreen.quarterFinal;
    return `Round ${round}`;
  };

  const totalParticipantsAllowed = event?.totalTeams ?? 0;
  const minRequiredForTeams = Math.ceil(totalParticipantsAllowed * 0.2);

  const categoryId = isMixedCategory ? 'Mixed-Singles' : `${gender}-${format}`;
  const isAbandoned = event?.abandonedCategories?.includes(categoryId) ?? false;

  const canCreateTeams =
    participants.length >= minRequiredForTeams && !isAbandoned;

  const canCreateFixtures =
    format === FormatType.Singles
      ? participants.length >= 2
      : teams.length >= 2;

  const generateBracket = (
    names: string[],
    bracketGender: GenderType,
    bracketFormat: FormatType,
  ): Fixture[] => {
    const generatedFixtures: Fixture[] = [];
    const teamList = [...names].sort(() => Math.random() - 0.5);
    const targetSize = nextPowerOfTwo(teamList.length);
    const totalRounds = Math.ceil(Math.log2(targetSize));

    let bracketPosition = 0;
    const round1MatchCount = targetSize / 2;

    for (let index = 0; index < round1MatchCount; index++) {
      const teamAIndex = index * 2;
      const teamBIndex = index * 2 + 1;

      const teamA = teamAIndex < teamList.length ? teamList[teamAIndex] : 'BYE';
      const teamB = teamBIndex < teamList.length ? teamList[teamBIndex] : 'BYE';

      if (teamA === 'BYE' && teamB === 'BYE') {
        bracketPosition++;
        continue;
      }

      generatedFixtures.push({
        id: generateFixtureId(),
        teamA,
        teamB,
        scoreA: 0,
        scoreB: 0,
        round: 1,
        totalRounds,
        time: new Date().toISOString(),
        status:
          teamA === 'BYE' || teamB === 'BYE'
            ? MatchStatus.COMPLETED
            : MatchStatus.UPCOMING,
        winner: teamA === 'BYE' ? teamB : teamB === 'BYE' ? teamA : undefined,
        gender: bracketGender,
        format: bracketFormat,
        bracketPosition: bracketPosition++,
      });
    }

    for (let round = 2; round <= totalRounds; round++) {
      const matchesInRound = targetSize / Math.pow(2, round);
      for (let index = 0; index < matchesInRound; index++) {
        const prevRoundPos1 = index * 2;
        const prevRoundPos2 = index * 2 + 1;

        const prevMatch1 = generatedFixtures.find(
          (fixture) =>
            fixture.round === round - 1 &&
            fixture.bracketPosition === prevRoundPos1,
        );
        const prevMatch2 = generatedFixtures.find(
          (fixture) =>
            fixture.round === round - 1 &&
            fixture.bracketPosition === prevRoundPos2,
        );

        let teamA = 'TBD';
        let teamB = 'TBD';

        if (prevMatch1?.status === MatchStatus.COMPLETED && prevMatch1.winner) {
          teamA = prevMatch1.winner;
        }
        if (prevMatch2?.status === MatchStatus.COMPLETED && prevMatch2.winner) {
          teamB = prevMatch2.winner;
        }

        generatedFixtures.push({
          id: generateFixtureId(),
          teamA,
          teamB,
          scoreA: 0,
          scoreB: 0,
          round,
          totalRounds,
          time: new Date().toISOString(),
          status: MatchStatus.UPCOMING,
          gender: bracketGender,
          format: bracketFormat,
          bracketPosition: index,
        });
      }
    }

    return generatedFixtures;
  };

  const createTeamsInternal = () => {
    if (!event) return;

    const newTeams: Team[] = [];
    let teamIndex = event.teams.length + 1;

    for (let index = 0; index + 1 < participants.length; index += 2) {
      const pair = participants.slice(index, index + 2);
      newTeams.push({
        id: `team-${Date.now()}-${teamIndex}`,
        name: `Team ${teamIndex}`,
        players: pair,
        gender,
        format,
      });
      teamIndex++;
    }

    const otherTeams = event.teams.filter(
      (team) => !(team.gender === gender && team.format === format),
    );

    const hasOddParticipants = participants.length % 2 !== 0;
    if (hasOddParticipants) {
      Alert.alert(
        APP_STRINGS.eventScreen.note,
        APP_STRINGS.eventScreen.oddRegistrationsAlert,
      );
    }

    updateEvent({
      ...event,
      teams: [...otherTeams, ...newTeams],
      teamsCreated: true,
    });
  };

  const handleCreateTeams = () => {
    if (!event) return;

    if (format === FormatType.Singles) {
      Alert.alert(APP_STRINGS.eventScreen.noTeamsRequired);
      return;
    }

    if (participants.length < 2) {
      Alert.alert(APP_STRINGS.eventScreen.noEnoughRegistrations);
      return;
    }

    if (participants.length < totalParticipantsAllowed) {
      Alert.alert(
        APP_STRINGS.eventScreen.createTeam,
        `You are about to create teams with ${
          participants.length
        } participants (${
          totalParticipantsAllowed - participants.length
        } slots remaining). Continue?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Continue',
            onPress: createTeamsInternal,
          },
        ],
      );
    } else {
      createTeamsInternal();
    }
  };

  const handleCreateFixtures = () => {
    if (!event) return;

    if (isAbandoned) {
      Alert.alert(
        APP_STRINGS.eventScreen.categoryAbandoned,
        APP_STRINGS.eventScreen.categoryAbandonedDescription,
      );
      return;
    }

    const names =
      format === FormatType.Singles
        ? participants.map((player) => player.name)
        : teams.map((team) => team.name);

    if (names.length < 2) {
      Alert.alert(APP_STRINGS.eventScreen.notEnoughSameGenderParticipants);
      return;
    }

    const newFixtures = generateBracket(names, gender, format);

    const otherFixtures = event.fixtures.filter(
      (fixture) => !(fixture.gender === gender && fixture.format === format),
    );

    updateEvent({
      ...event,
      fixtures: [...otherFixtures, ...newFixtures],
      fixturesCreated: true,
      status: EventStatus.LIVE,
    });
  };

  return {
    event,
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
    filteredFixtures,
    isAdminOrOrganizer,
    canManageEvent,
    isAbandoned,
    canCreateTeams,
    canCreateFixtures,
    minRequiredForTeams,
    hasTeamsForGender: teams.length > 0,
    hasFixturesForGender: fixtures.length > 0,
    getRoundName,
    handleCreateTeams,
    handleCreateFixtures,
    handleSetLive: (id: string) =>
      updateFixtureStatus(eventId, id, MatchStatus.LIVE),
    handleUpdateScore: (id: string, a: number, b: number) =>
      updateFixtureScore(eventId, id, a, b),
    handleCompleteFixture: (id: string, a: number, b: number) =>
      completeFixture(eventId, id, a, b),
  };
};
