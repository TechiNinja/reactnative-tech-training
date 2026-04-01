import { authFetch } from '../utils/authFetch';
import { API_ENDPOINTS } from '../config/api';
import { EventResponse } from '../models/EventResponse';

export type CreateEventPayload = {
  eventRequestId: number;
  name: string;
  registrationDeadline: string;
  description: string;
  maxParticipantsCount: number;
};

export type PatchEventPayload = {
  action: 'update' | 'cancel';
  name?: string;
  description?: string;
  maxParticipantsCount?: number;
  registrationDeadline?: string;
};

export type EventRequestPrefillResponse = {
  eventName: string;
  sportsName: string;
  requestedVenue: string;
  startDate: string;
  endDate: string;
  gender: string;
  format: string;
};

export const getAllEvents = (filters?: { id?: number; name?: string; status?: string; sportId?: number }) => {
  const params = new URLSearchParams();
  if (filters?.id) params.append('id', String(filters.id));
  if (filters?.name) params.append('name', filters.name);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.sportId) params.append('sportId', String(filters.sportId));
  const query = params.toString();
  return authFetch<EventResponse[]>(query ? `${API_ENDPOINTS.EVENTS.BASE}?${query}` : API_ENDPOINTS.EVENTS.BASE);
};

export const getEventById = (id: number) =>
  authFetch<EventResponse[]>(API_ENDPOINTS.EVENTS.BY_ID(id));

export const createEvent = (body: CreateEventPayload) =>
  authFetch(API_ENDPOINTS.EVENTS.BASE, { method: 'POST', body: JSON.stringify(body) });

export const patchEvent = (id: number, body: PatchEventPayload) =>
  authFetch(API_ENDPOINTS.EVENTS.PATCH_BY_ID(id), { method: 'PATCH', body: JSON.stringify(body) });

export const assignOrganizer = (id: number, organizerId: number) =>
  authFetch(API_ENDPOINTS.EVENTS.ASSIGN_ORGANIZER(id), { method: 'PATCH', body: JSON.stringify(organizerId) });

export const getEventCategories = (id: number) =>
  authFetch(API_ENDPOINTS.EVENTS.CATEGORIES(id));

export const getEventRequestPrefill = (requestId: number) =>
  authFetch<EventRequestPrefillResponse>(API_ENDPOINTS.EVENTS.REQUEST_PREFILL(requestId));