import { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import {
  ApiTeamResponse,
  OrganizerService,
} from '../services/organizerService';
import { useEventStore } from '../store/EventStore';
import { useAuthStore } from '../store/AuthStore';
import { APP_STRINGS } from '../constants/appStrings';
import {
  EventStatus,
  FixtureTabType,
  FormatType,
  GenderType,
  MatchStatus,
  Team,
} from '../models/Event';
import { generateTeams } from '../utils/teamUtils';
import { generateBracket, nextPowerOfTwo } from '../utils/fixtureUtils';

const PARTICIPANTS_TAB = 'PARTICIPANTS';
const TEAMS_TAB = 'TEAMS';
const FIXTURES_TAB = 'FIXTURES';

type CategoryDetailsRouteProp = RouteProp<
  RootStackParamList,
  'CategoryDetails'
>;

export const useCategoryDetailsViewModel = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<CategoryDetailsRouteProp>();
  const { eventId, gender, format, role, eventCategoryId } = route.params;

  const {
    events,
    updateEvent,
    updateFixtureScore,
    updateFixtureStatus,
    completeFixture,
  } = useEventStore();

  const { user } = useAuthStore();

  const event = events.find((event) => event.id === eventId) ?? null;

  const mainTabs = useMemo(() => {
    const tabs: string[] = [];
    if (role !== 'participant') tabs.push(PARTICIPANTS_TAB);
    if (format === FormatType.Doubles) tabs.push(TEAMS_TAB);
    tabs.push(FIXTURES_TAB);
    return tabs;
  }, [role, format]);

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

  const participants = useMemo(() => {
    if (!event) return [];
    if (isMixedCategory) {
      return event.registrations.filter((player) =>
        player.formats?.includes(format),
      );
    }
    return event.registrations.filter(
      (player) => player.gender === gender && player.formats?.includes(format),
    );
  }, [event, isMixedCategory, format, gender]);

  const teams = useMemo(() => {
    if (!event) return [];
    return event.teams.filter(
      (team) => team.gender === gender && team.format === format,
    );
  }, [event, gender, format]);

  const filteredTeams = useMemo(() => {
    if (!searchQuery.trim()) return teams;
    return teams.filter((team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [teams, searchQuery]);

  const fixtures = useMemo(() => {
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
  }, [event, isMixedCategory, format, gender]);

  const filteredFixtures = useMemo(() => {
    let result = fixtures;
    if (activeFixtureTab !== FixtureTabType.ALL) {
      result = result.filter(
        (fixture) =>
          fixture.status === (activeFixtureTab as unknown as MatchStatus),
      );
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (fixture) =>
          fixture.teamA?.toLowerCase().includes(query) ||
          fixture.teamB?.toLowerCase().includes(query),
      );
    }
    return result;
  }, [fixtures, activeFixtureTab, searchQuery]);

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

  const createTeamsInternal = () => {
    if (!event) return;

    const newTeams = generateTeams(
      participants,
      gender,
      format,
      event.teams.length,
    );

    const otherTeams = event.teams.filter(
      (team) => !(team.gender === gender && team.format === format),
    );

    if (participants.length % 2 !== 0) {
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

  const handleCreateTeams = async () => {
    if (!event) return;

    if (format === FormatType.Singles) {
      Alert.alert(APP_STRINGS.eventScreen.noTeamsRequired);
      return;
    }

    if (participants.length < 2) {
      Alert.alert(APP_STRINGS.eventScreen.noEnoughRegistrations);
      return;
    }

    if (typeof eventCategoryId === 'number') {
      try {
        const apiTeams = (await OrganizerService.createTeams(
          eventCategoryId,
        )) as ApiTeamResponse[];

        const newTeams: Team[] = apiTeams.map((apiTeam) => ({
          id: apiTeam.id.toString(),
          name: apiTeam.name,
          players: apiTeam.members.map((memberName, index) => ({
            id: `${apiTeam.id}-${index}`,
            name: memberName,
            gender,
            formats: [format],
          })),
          gender,
          format,
        }));

        const otherTeams = event.teams.filter(
          (team) => !(team.gender === gender && team.format === format),
        );

        updateEvent({
          ...event,
          teams: [...otherTeams, ...newTeams],
          teamsCreated: true,
        });
      } catch {
        Alert.alert(
          APP_STRINGS.eventScreen.createTeam,
          APP_STRINGS.eventScreen.teamCreationFailed,
        );
      }
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
          { text: APP_STRINGS.buttons.cancel, style: 'cancel' },
          {
            text: APP_STRINGS.buttons.continue,
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
