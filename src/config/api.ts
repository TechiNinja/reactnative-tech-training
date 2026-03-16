export const API_BASE_URL = 'http://192.168.4.84:5181/api';
export const API_BASE_URLL = 'http://192.168.4.84:5181';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/Auth/login',
    REGISTER: '/Auth/register',
  },
  USERS: '/Users',
  ROLES: '/Roles',
  SPORT: '/sports',
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
    CREATE_TEAMS: '/Teams/create',
    GET_TEAMS: (eventCategoryId: number) => `/Teams?eventCategoryId=${eventCategoryId}`,
    GET_PARTICIPANTS: (eventCategoryId: number) =>
      `/participantregistrations/${eventCategoryId}`,
  },
  ANALYTICS: '/analytics',
  EVENTS: {
  BASE: '/events',
  BY_ID: (id: number) => `/events?id=${id}`,
  CATEGORIES: (id: number) => `/events/${id}/categories`,
  ASSIGN_ORGANIZER: (id: number) => `/events/${id}/organizer`,
  USER_EVENTS: (userId: number) => `/events/user/${userId}`,
},
CATEGORIES: {
  BY_ID: (categoryId: number) => `/categories/${categoryId}`,
  GENERATE_FIXTURE: (categoryId: number) => `/categories/${categoryId}/generate-fixture`,
  GET_FIXTURES: (categoryId: number, status?: string) =>
    status ? `/categories/${categoryId}/fixtures?status=${status}` : `/categories/${categoryId}/fixtures`,
  BULK_SCHEDULE: (categoryId: number) => `/categories/${categoryId}/fixtures/schedule`,
  DELETE_FIXTURES: (categoryId: number) => `/categories/${categoryId}/fixtures`,
},
MATCHES: {
  BY_ID: (matchId: number) => `/matches/${matchId}`,
  SETS: (matchId: number) => `/matches/${matchId}/sets`,
  SET_BY_ID: (matchId: number, setId: number) => `/matches/${matchId}/sets/${setId}`,
},
REGISTRATIONS: {
  REGISTER: '/participantregistrations',
  BY_CATEGORY: (categoryId: number) => `/participantregistrations/${categoryId}`,
},
};