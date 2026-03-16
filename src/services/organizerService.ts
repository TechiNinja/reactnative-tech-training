import { API_ENDPOINTS } from '../config/api';
import { authFetch } from '../utils/authFetch';

export type ApiTeamResponse = {
  id: number;
  name: string;
  members: string[];
};

export const OrganizerService = {
  createTeams: async (eventCategoryId: number) => {
    console.log('createTeams called with', eventCategoryId);
    try {
      const result = await authFetch<ApiTeamResponse[]>(API_ENDPOINTS.ORGANIZER.CREATE_TEAMS, {
        method: 'POST',
        body: JSON.stringify({ eventCategoryId }),
      });
      console.log('createTeams result', JSON.stringify(result));
      return result;
    } catch (e: any) {
      console.log('createTeams error', e?.message);
      throw e;
    }
  },

  getTeams: (eventCategoryId: number) =>
    authFetch<ApiTeamResponse[]>(API_ENDPOINTS.ORGANIZER.GET_TEAMS(eventCategoryId)),
};