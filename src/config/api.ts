export const API_BASE_URL = 'http://localhost:5181/api';
export const API_BASE_URLL = 'http://localhost:5181';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/Auth/login',
    REGISTER: '/Auth/register',
  },
  USERS: '/Users',
  ROLES: '/Roles',
  SPORT: '/Sport',
  NOTIFICATIONS: '/Notifications',
  EVENT_REQUESTS: {
    BASE: '/event-requests',
    BY_ID: (id: number) => `/event-requests/${id}`,
    WITHDRAW: (id: number) => `/event-requests/${id}/withdraw`,
    DECIDE: (id: number, status: 'Approved' | 'Rejected') =>
      `/Operation/${id}/${status}`,
  },
  PARTICIPANT: {
    EVENTS: (userId: number) => `/Events/${userId}`,
    TEAM: (userId: number) => `/Teams/${userId}`,
    SCHEDULE: (userId: number) => `/Schedules/${userId}`,
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