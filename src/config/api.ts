export const API_BASE_URL = 'http://10.0.2.2:5000/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
  },
  USERS: `${API_BASE_URL}/users`,
  ROLES: `${API_BASE_URL}/roles`,
  PARTICIPANT: {
    EVENTS: (userId: number) => `${API_BASE_URL}/events/${userId}`,
    TEAM: (userId: number) => `${API_BASE_URL}/teams/${userId}`,
    SCHEDULE: (userId: number) => `${API_BASE_URL}/schedules/${userId}`,
    REGISTER: `${API_BASE_URL}/participantregistrations`,
  },
  ORGANIZER: {
    CREATE_TEAMS: `${API_BASE_URL}/categoryteam/create`,
    GET_TEAMS: (eventCategoryId: number) =>
      `${API_BASE_URL}/categoryteam/${eventCategoryId}`,
    GET_PARTICIPANTS: (eventCategoryId: number) =>
      `${API_BASE_URL}/participantregistrations/${eventCategoryId}`,
  },
};
