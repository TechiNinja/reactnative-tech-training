import { API_ENDPOINTS } from '../config/api';
import { authFetch } from '../utils/authFetch';

export type ApiTeamResponse = {
  id: number;
  name: string;
  members: string[];
};

export const OrganizerService = {
  createTeams: (eventCategoryId: number) =>
    authFetch(API_ENDPOINTS.ORGANIZER.CREATE_TEAMS, {
      method: 'POST',
      body: JSON.stringify({ EventCategoryId: eventCategoryId }),
    }),
};
