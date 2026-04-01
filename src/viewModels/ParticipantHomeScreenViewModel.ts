import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/AuthStore';
import {
  getMyEvents,
  getMySchedule,
  getMyTeams,
  ApiScheduleRaw,
  ApiEvent,
} from '../services/participantService';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Alert } from 'react-native';
import { APP_STRINGS } from '../constants/AppStrings';

type ApiTeam = {
  id: number;
  name: string;
  members: string[];
  eventCategoryId: number;
};

type ApiSchedule = {
  id: number;
  teamA: string;
  teamB: string;
  status: string;
  sport: string;
  scoreA: number;
  scoreB: number;
};

export const useParticipantHomeViewModel = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, logout } = useAuthStore();

  const [myTeams, setMyTeams] = useState<ApiTeam[]>([]);
  const [myEvents, setMyEvents] = useState<ApiEvent[]>([]);
  const [myEventsCount, setMyEventsCount] = useState(0);
  const [todaysMatches, setTodaysMatches] = useState<ApiSchedule[]>([]);
  const [matchesPlayedCount, setMatchesPlayedCount] = useState(0);
  const [winsCount, setWinsCount] = useState(0);

  useEffect(() => {
    if (!user?.id) return;

    const loadData = async () => {
      try {
        let teams: ApiTeam[] = [];
        try {
          teams = await getMyTeams(user.id);
        } catch (error: unknown) {
          if (error instanceof Error && error.message.includes('404')) {
            teams = [];
          } else {
            throw error;
          }
        }
        setMyTeams(teams);

        let events: ApiEvent[] = [];
        try {
          events = await getMyEvents(user.id);
        } catch (error: unknown) {
          if (error instanceof Error && error.message.includes('404')) {
            events = [];
          } else {
            throw error;
          }
        }
        setMyEvents(events);
        setMyEventsCount(events.length);

        let rawSchedule: ApiScheduleRaw[] = [];
        try {
          rawSchedule = await getMySchedule(user.id);
        } catch (error: unknown) {
          if (error instanceof Error && error.message.includes('404')) {
            rawSchedule = [];
          } else {
            throw error;
          }
        }

        const resolveName = (side: string) => {
          if (!side) return APP_STRINGS.eventScreen.unknownTeam;

          const teamByName = teams.find((team) => team.name === side);
          if (teamByName && teamByName.name) return teamByName.name;

          const teamById = teams.find((team) => team.id.toString() === side);
          if (teamById && teamById.name) return teamById.name;

          return side || APP_STRINGS.eventScreen.unknownTeam;
        };

        const mapped = rawSchedule.map(
          (match: ApiScheduleRaw): ApiSchedule => ({
            id: match.matchId,
            teamA: resolveName(match.sideA),
            teamB: resolveName(match.sideB),
            scoreA: match.scoreA ?? 0,
            scoreB: match.scoreB ?? 0,
            status:
              match.scoreA !== null &&
              match.scoreA !== undefined &&
              match.scoreB !== null &&
              match.scoreB !== undefined
                ? 'COMPLETED'
                : 'UPCOMING',
            sport: match.eventName,
          }),
        );

        setTodaysMatches(mapped);

        let played = 0;
        let wins = 0;
        mapped.forEach((match) => {
          if (match.status === 'COMPLETED') {
            played++;
            if (match.scoreA > match.scoreB) wins++;
          }
        });

        setMatchesPlayedCount(played);
        setWinsCount(wins);
      } catch {
        Alert.alert('Error', APP_STRINGS.participantScreens.failedToLoadData);
      }
    };

    loadData();
  }, [user]);

  const onLogout = async () => {
    await logout();

    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth', params: { screen: 'Login' } }],
    });
  };

  const resolveCategoryName = (eventCategoryId: number): string => {
    const event = myEvents.find(
      (event: ApiEvent) => event.eventId === eventCategoryId,
    );

    if (event && event.eventName) {
      const eventPattern = event.eventName.replace(
        /\s+(Event|Tournament|Championship|Competetion|Match|Game)\s*$/i,
        '',
      );

      const testPattern = eventPattern.replace(/^(Test|Demo|Sample)\s+/i, '');

      const extractedName = testPattern.trim();
      return extractedName.length > 0 &&
        extractedName.length < event.eventName.length
        ? extractedName
        : event.eventName;
    }
    return APP_STRINGS.eventScreen.unknownSport;
  };

  return {
    user,
    onLogout,
    myTeams,
    myEvents,
    myTeamsCount: myTeams.length,
    myEventsCount,
    todaysMatches,
    matchesPlayedCount,
    winsCount,
    resolveCategoryName,
  };
};
