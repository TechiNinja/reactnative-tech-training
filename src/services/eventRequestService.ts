import { API_ENDPOINTS } from '../config/api';
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

  if (filter.id !== undefined) {
    params.append('id', String(filter.id));
  }

  if (filter.status !== undefined) {
    params.append('status', filter.status);
  }

  if (filter.adminId !== undefined) {
    params.append('adminId', String(filter.adminId));
  }

  const query = params.toString();
  return query ? `?${query}` : '';
}

export const eventRequestService = {
  getSports(): Promise<Sport[]> {
    return authFetch<Sport[]>(API_ENDPOINTS.SPORT);
  },

  search(filter: EventRequestFilter = {}): Promise<EventRequestResponse[]> {
    return authFetch<EventRequestResponse[]>(
      `${API_ENDPOINTS.EVENT_REQUESTS.BASE}${toQueryString(filter)}`,
    );
  },

  getById(id: number): Promise<EventRequestResponse> {
    return authFetch<EventRequestResponse>(API_ENDPOINTS.EVENT_REQUESTS.BY_ID(id));
  },

  create(payload: CreateEventRequest): Promise<EventRequestResponse> {
    return authFetch<EventRequestResponse>(API_ENDPOINTS.EVENT_REQUESTS.BASE, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update(id: number, payload: EditEventRequest): Promise<EventRequestResponse> {
    return authFetch<EventRequestResponse>(API_ENDPOINTS.EVENT_REQUESTS.BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  withdraw(id: number): Promise<EventRequestResponse> {
    return authFetch<EventRequestResponse>(API_ENDPOINTS.EVENT_REQUESTS.WITHDRAW(id), {
      method: 'PATCH',
    });
  },

  decide(
    id: number,
    payload: DecideEventRequest,
  ): Promise<EventRequestResponse> {
    return authFetch<EventRequestResponse>(
      API_ENDPOINTS.EVENT_REQUESTS.DECIDE(id),
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      },
    );
  },
};