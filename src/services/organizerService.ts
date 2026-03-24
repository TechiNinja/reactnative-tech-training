import { API_ENDPOINTS } from '../config/api';
import { authFetch } from '../utils/authFetch';

export type ApiTeamResponse = {
  id: number;
  name: string;
  members: string[];
};

export const OrganizerService = {
  createTeams: (eventCategoryId: number): Promise<ApiTeamResponse[]> =>
    authFetch(API_ENDPOINTS.ORGANIZER.CREATE_TEAMS, {
      method: 'POST',
      body: JSON.stringify({ eventCategoryId }),
    }),

  getTeams: (eventCategoryId: number): Promise<ApiTeamResponse[]> =>
    authFetch(API_ENDPOINTS.ORGANIZER.GET_TEAMS(eventCategoryId), {
      method: 'GET',
    }),
};