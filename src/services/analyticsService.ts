import { authFetch } from '../utils/authFetch';
import { API_ENDPOINTS } from '../config/api';

export type AdminAnalytics = {
  totalEvents: number;
  activeUsers: number;
  teams: number;
  matchesToday: number;
};

export type OrganizerAnalytics = {
  myEvents: number;
  totalRegistrations: number;
  teamsRegistered: number;
  liveMatches: number;
};

export const AnalyticsService = {
  getAdminAnalytics: () => authFetch<AdminAnalytics>(API_ENDPOINTS.ANALYTICS),

  getOrganizerAnalytics: () =>
    authFetch<OrganizerAnalytics>(API_ENDPOINTS.ANALYTICS),
};
