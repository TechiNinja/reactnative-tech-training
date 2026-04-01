import { Platform } from 'react-native';

const HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
export const API_BASE_URL = `http://${HOST}:5000/api`;
export const API_WS_BASE_URL = `http://${HOST}:5000`;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/Auth/login',
    REGISTER: '/Auth/register',
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
    EVENTS: (userId: number) => `/events/user/${userId}`,
    SCHEDULE: (userId: number) => `/Schedules/${userId}`,
    REGISTER: '/ParticipantRegistrations',
    TEAM: (userId: number) => `/Teams?userId=${userId}`,
  },
  ANALYTICS: '/Analytics',
  NOTIFICATIONS: {
    BASE: '/Notifications',
    MARK_READ: '/Notifications/mark-read',
    UNREAD_COUNT: '/Notifications/unread-count',
  },
  EVENTS: {
    BASE: '/event-management',
    BY_ID: (id: number) => `/event-management?eventId=${id}`,
    PATCH_BY_ID: (id: number) => `/event-management/${id}`,
    CATEGORIES: (id: number) => `/event-management/${id}/categories`,
    ASSIGN_ORGANIZER: (id: number) => `/event-management/${id}/organizer`,
    USER_EVENTS: (userId: number) => `/event-management/user/${userId}`,
    REQUEST_PREFILL: (requestId: number) => `/event-management/request/${requestId}`,
  },
  CATEGORIES: {
    BY_ID: (categoryId: number) => `/eventCategories/${categoryId}`,
    GENERATE_FIXTURE: (categoryId: number) => `/eventCategories/${categoryId}/generate-fixture`,
    GET_FIXTURES: (categoryId: number, status?: string) =>
      status ? `/matches/${categoryId}/fixtures?status=${status}` : `/matches/${categoryId}/fixtures`,
    BULK_SCHEDULE: (categoryId: number) => `/eventCategories/${categoryId}/fixtures/reschedule`,
    DELETE_FIXTURES: (categoryId: number) => `/matches/${categoryId}/fixtures`,
  },
  MATCHES: {
    BY_ID: (matchId: number) => `/matches/${matchId}`,
    SETS: (matchId: number) => `/matches/${matchId}/sets`,
    SET_BY_ID: (matchId: number, setId: number) => `/matches/${matchId}/sets/${setId}`,
    RESCHEDULE: (matchId: number) => `/matches/${matchId}/reschedule`,
  },
  REGISTRATIONS: {
    REGISTER: '/participantregistrations',
    BY_CATEGORY: (categoryId: number) => `/participantregistrations/${categoryId}`,
  },
  ORGANIZER: {
    CREATE_TEAMS: '/Teams/create',
    GET_TEAMS: (eventCategoryId: number) => `/Teams?eventCategoryId=${eventCategoryId}`,
    GET_PARTICIPANTS: (eventCategoryId: number) => `/participantregistrations/${eventCategoryId}`,
  },
};