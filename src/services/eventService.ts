import { authFetch } from '../utils/authFetch';
import { API_ENDPOINTS } from '../config/api';

export const getAllEvents = (filters?: { id?: number; name?: string; status?: string; sportId?: number }) => {
  const params = new URLSearchParams();
  if (filters?.id) params.append('id', String(filters.id));
  if (filters?.name) params.append('name', filters.name);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.sportId) params.append('sportId', String(filters.sportId));
  return authFetch(`${API_ENDPOINTS.EVENTS.BASE}?${params.toString()}`);
};

export const getEventById = (id: number) =>
  authFetch(API_ENDPOINTS.EVENTS.BY_ID(id));

export const createEvent = (body: object) =>
  authFetch(API_ENDPOINTS.EVENTS.BASE, { method: 'POST', body: JSON.stringify(body) });

export const patchEvent = (id: number, body: object) =>
  authFetch(`${API_ENDPOINTS.EVENTS.BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(body) });

export const assignOrganizer = (id: number, organizerId: number) =>
  authFetch(API_ENDPOINTS.EVENTS.ASSIGN_ORGANIZER(id), { method: 'PATCH', body: JSON.stringify(organizerId) });

export const getEventCategories = (id: number) =>
  authFetch(API_ENDPOINTS.EVENTS.CATEGORIES(id));