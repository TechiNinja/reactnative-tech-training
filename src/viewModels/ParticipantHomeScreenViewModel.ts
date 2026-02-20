import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/AuthStore';
import {
  getMyEvents,
  getMySchedule,
  getMyTeams,
} from '../services/participantService';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Alert } from 'react-native';

type ApiTeam = {
  teamId: number;
  teamName: string;
  category: string;
  eventName: string;
};

type ApiScheduleRaw = {
  matchId: number;
  matchDateTime: string;
  venue: string;
  sideA: string;
  sideB: string;
  scoreA: number;
  scoreB: number;
  eventName: string;
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

export const useParticipantHomeViewModel = (
  navigation: NativeStackNavigationProp<RootStackParamList>,
) => {
  const { user, logout } = useAuthStore();

  const [myTeams, setMyTeams] = useState<ApiTeam[]>([]);
  const [myEventsCount, setMyEventsCount] = useState(0);
  const [todaysMatches, setTodaysMatches] = useState<ApiSchedule[]>([]);
  const [matchesPlayedCount, setMatchesPlayedCount] = useState(0);
  const [winsCount, setWinsCount] = useState(0);

  useEffect(() => {
    if (!user?.id) return;

    const resolveName = (id: string) => {
      const participant = myTeams.find((team) => team.teamId.toString() === id);
      return participant ? participant.teamName : `Player ${id}`;
    };

    const loadData = async () => {
      try {
        const teams = await getMyTeams(user.id);
        setMyTeams(teams);

        const events = await getMyEvents(user.id);
        setMyEventsCount(events.length);

        const rawSchedule = await getMySchedule(user.id);
        const mapped = rawSchedule.map((match: ApiScheduleRaw) => ({
          id: match.matchId,
          teamA: resolveName(match.sideA),
          teamB: resolveName(match.sideB),
          scoreA: match.scoreA,
          scoreB: match.scoreB,
          status:
            match.scoreA !== null && match.scoreB !== null
              ? 'COMPLETED'
              : 'UPCOMING',
          sport: match.eventName,
        }));

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
        Alert.alert('Error', 'Failed to load participant data');
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

  return {
    user,
    onLogout,
    myTeams,
    myTeamsCount: myTeams.length,
    myEventsCount,
    todaysMatches,
    matchesPlayedCount,
    winsCount,
  };
};
