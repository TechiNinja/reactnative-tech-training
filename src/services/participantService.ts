import { API_ENDPOINTS } from '../config/api';
import { getToken } from '../utils/authStorage';

export type ApiParticipantRegistration = {
  id: number;
  userId: number;
  name: string;
  eventCategoryId: number;
  registeredAt: string;
};

export type ApiTeam = {
  teamId: number;
  teamName: string;
  category: string;
  eventName: string;
};

export type ApiEvent = {
  eventId: number;
  eventName: string;
  startDate: string;
  endDate: string;
};

export type ApiScheduleRaw = {
  matchId: number;
  matchDateTime: string;
  venue: string;
  sideA: string;
  sideB: string;
  scoreA: number;
  scoreB: number;
  eventName: string;
};

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

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    throw new Error(`Failed request: ${res.status}`);
  }
  return res.json() as Promise<T>;
};

export const getMyTeams = (userId: number) =>
  authFetch<ApiTeam[]>(API_ENDPOINTS.PARTICIPANT.TEAM(userId));

export const getMyEvents = (userId: number) =>
  authFetch<ApiEvent[]>(API_ENDPOINTS.PARTICIPANT.EVENTS(userId));

export const getMySchedule = (userId: number) =>
  authFetch<ApiScheduleRaw[]>(API_ENDPOINTS.PARTICIPANT.SCHEDULE(userId));

export const registerParticipant = (userId: number, eventCategoryId: number) =>
  authFetch<ApiParticipantRegistration>(API_ENDPOINTS.PARTICIPANT.REGISTER, {
    method: 'POST',
    body: JSON.stringify({ userId, eventCategoryId }),
  });

export const ParticipantService = {
  getMyTeams,
  getMyEvents,
  getMySchedule,
  registerParticipant,
};
