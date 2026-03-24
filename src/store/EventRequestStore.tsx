import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  CreateEventRequest,
  DecideEventRequest,
  EditEventRequest,
  EventRequestFilter,
  EventRequestResponse,
} from '../models/EventRequest';
import { eventRequestService } from '../services/eventRequestService';
import { APP_STRINGS } from '../constants/appStrings';

type DecideStatus = 'Approved' | 'Rejected';

type EventRequestStoreType = {
  requests: EventRequestResponse[];
  selectedRequest: EventRequestResponse | null;
  loading: boolean;
  error: string | null;
  fetchRequests: (filter?: EventRequestFilter) => Promise<void>;
  fetchRequestById: (id: number) => Promise<EventRequestResponse | null>;
  createRequest: (payload: CreateEventRequest) => Promise<EventRequestResponse>;
  updateRequest: (
    id: number,
    payload: EditEventRequest,
  ) => Promise<EventRequestResponse>;
  withdrawRequest: (id: number) => Promise<EventRequestResponse>;
  decideRequest: (
    id: number,
    status: DecideStatus,
    payload: DecideEventRequest,
  ) => Promise<EventRequestResponse>;
  setSelectedRequest: (request: EventRequestResponse | null) => void;
};

const EventRequestContext = createContext<EventRequestStoreType | undefined>(undefined);

export const EventRequestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<EventRequestResponse[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<EventRequestResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to update request lists and selected request
  const updateRequestInState = (updated: EventRequestResponse) => {
    setRequests(prev => prev.map(r => (r.id === updated.id ? updated : r)));
    setSelectedRequest(prev => (prev?.id === updated.id ? updated : prev));
  };

  const fetchRequests = useCallback(async (filter?: EventRequestFilter) => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventRequestService.search(filter);
      setRequests(data);
    } catch (err) {
      setRequests([]);
      setError(err instanceof Error ? err.message : APP_STRINGS.stores.somethingWentWrong);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRequestById = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventRequestService.getById(id);
      setSelectedRequest(data);
      return data;
    } catch (err) {
      setSelectedRequest(null);
      setError(err instanceof Error ? err.message : APP_STRINGS.stores.somethingWentWrong);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (payload: CreateEventRequest) => {
    const created = await eventRequestService.create(payload);
    setRequests(prev => [created, ...prev]);
    return created;
  };

  const updateRequest = async (id: number, payload: EditEventRequest) => {
    const updated = await eventRequestService.update(id, payload);
    updateRequestInState(updated);
    return updated;
  };

  const withdrawRequest = async (id: number) => {
    const updated = await eventRequestService.withdraw(id);
    updateRequestInState(updated);
    return updated;
  };

  const decideRequest = async (id: number, status: DecideStatus, payload: DecideEventRequest) => {
    const updated = await eventRequestService.decide(id, status, payload);
    updateRequestInState(updated);
    return updated;
  };

  return (
    <EventRequestContext.Provider
      value={{
        requests,
        selectedRequest,
        loading,
        error,
        fetchRequests,
        fetchRequestById,
        createRequest,
        updateRequest,
        withdrawRequest,
        decideRequest,
        setSelectedRequest,
      }}
    >
      {children}
    </EventRequestContext.Provider>
  );
};

export const useEventRequestStore = () => {
  const context = useContext(EventRequestContext);
  if (!context) {
    throw new Error(APP_STRINGS.stores.eventRequestStoreError);
  }
  return context;
};