import { authFetch } from '../utils/authFetch';
import {
  CreateEventRequest,
  DecideEventRequest,
  EditEventRequest,
  EventRequestFilter,
  EventRequestResponse,
  Sport,
} from '../models/EventRequest';

function toQueryString(filter: EventRequestFilter = {}) {
  const params = new URLSearchParams();

  if (filter.id !== undefined) params.append('id', String(filter.id));
  if (filter.status !== undefined) params.append('status', filter.status);
  if (filter.adminId !== undefined) params.append('adminId', String(filter.adminId));

  const query = params.toString();
  return query ? `?${query}` : '';
}

export const eventRequestService = {
  getSports(): Promise<Sport[]> {
    return authFetch<Sport[]>('/Sport');
  },

  search(filter: EventRequestFilter = {}): Promise<EventRequestResponse[]> {
    return authFetch<EventRequestResponse[]>(
      `/event-requests${toQueryString(filter)}`,
    );
  },

  getById(id: number): Promise<EventRequestResponse> {
    return authFetch<EventRequestResponse>(`/event-requests/${id}`);
  },

  create(payload: CreateEventRequest): Promise<EventRequestResponse> {
    return authFetch<EventRequestResponse>('/event-requests', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update(id: number, payload: EditEventRequest): Promise<EventRequestResponse> {
    return authFetch<EventRequestResponse>(`/event-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  withdraw(id: number): Promise<EventRequestResponse> {
    return authFetch<EventRequestResponse>(`/event-requests/${id}/withdraw`, {
      method: 'PATCH',
    });
  },

  decide(
    id: number,
    status: 'Approved' | 'Rejected',
    payload: DecideEventRequest,
  ): Promise<EventRequestResponse> {
    return authFetch<EventRequestResponse>(`/Operation/${id}/${status}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
};