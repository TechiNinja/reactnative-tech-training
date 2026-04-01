import { API_ENDPOINTS } from '../config/api';
import { authFetch } from '../utils/authFetch';

export type ApiParticipantRegistration = {
  id: number;
  userId: number;
  name: string;
  eventCategoryId: number;
  registeredAt: string;
};

export type ApiTeam = {
  id: number;
  name: string;
  members: string[];
  eventCategoryId: number;
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
