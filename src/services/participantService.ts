import { getToken } from '../utils/authStorage';

type ApiTeam = {
  teamId: number;
  teamName: string;
  category: string;
  eventName: string;
};

type ApiEvent = {
  eventId: number;
  eventName: string;
  startDate: string;
  endDate: string;
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

const BASE_URL = 'http://10.0.2.2:5000/api';

const authFetch = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const token = await getToken();

  const headers = {
    ...(options.headers || {}),
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };

  const res = await fetch(`${BASE_URL}${url}`, { ...options, headers });

  if (!res.ok) {
    throw new Error(`Failed request: ${res.status}`);
  }

  return res.json() as Promise<T>;
};

export const getMyTeams = (userId: number) => {
  return authFetch<ApiTeam[]>(`/MyTeams/${userId}`);
};

export const getMyEvents = (userId: number) => {
  return authFetch<ApiEvent[]>(`/MyEvents/${userId}`);
};

export const getMySchedule = (userId: number) => {
  return authFetch<ApiScheduleRaw[]>(`/MySchedules/${userId}`);
};
