import { Platform } from 'react-native';

const HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
export const API_BASE_URL = `http://${HOST}:5000/api`;
export const API_WS_BASE_URL = `http://${HOST}:5000`;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  USERS: '/Users',
  ROLES: '/Roles',
  SPORT: '/sports',

  EVENT_REQUESTS: {
    BASE: '/event-requests',
    BY_ID: (id: number) => `/event-requests/${id}`,
    WITHDRAW: (id: number) => `/event-requests/${id}/withdraw`,
    DECIDE: (id: number) => `/event-requests/${id}/review`,
  },

  PARTICIPANT: {
    EVENTS: (userId: number) => `/events/${userId}`,
    TEAM: (userId: number) => `/teams?userid=${userId}`,
    SCHEDULE: (userId: number) => `/schedules/${userId}`,
    REGISTER: '/participantregistrations',
  },
  ORGANIZER: {
    CREATE_TEAMS: '/teams/create',
    GET_TEAMS: (eventCategoryId: number) =>
      `/teams?categoryid=${eventCategoryId}`,
    GET_PARTICIPANTS: (eventCategoryId: number) =>
      `/participantregistrations/${eventCategoryId}`,
    EVENTS: (userId: number) => `/events/user/${userId}`,
    SCHEDULE: (userId: number) => `/Schedules/${userId}`,
    REGISTER: '/ParticipantRegistrations',
  },

  ANALYTICS: '/Analytics',

  NOTIFICATIONS: {
    BASE: '/Notifications',
    MARK_READ: '/Notifications/mark-read',
    UNREAD_COUNT: '/Notifications/unread-count',
  },
};
