import { Platform } from 'react-native';

const HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const API_BASE_URL = `http://${HOST}:5000/api`;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  USERS: '/users',
  ROLES: '/roles',
  PARTICIPANT: {
    EVENTS: (userId: number) => `/events/${userId}`,
    TEAM: (userId: number) => `/teams/${userId}`,
    SCHEDULE: (userId: number) => `/schedules/${userId}`,
    REGISTER: '/participantregistrations',
  },
  ORGANIZER: {
    CREATE_TEAMS: '/categoryteam/create',
    GET_TEAMS: (eventCategoryId: number) => `/categoryteam/${eventCategoryId}`,
    GET_PARTICIPANTS: (eventCategoryId: number) =>
      `/participantregistrations/${eventCategoryId}`,
  },
  ANALYTICS: '/analytics',
};
