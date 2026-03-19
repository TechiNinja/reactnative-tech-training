import { API_ENDPOINTS } from '../config/api';
import { authFetch } from '../utils/authFetch';
import { CreateSportRequest, SportResponse } from '../models/Sport';

export const sportService = {
  getAll: (): Promise<SportResponse[]> => {
    return authFetch<SportResponse[]>(API_ENDPOINTS.SPORT);
  },

  create: (payload: CreateSportRequest): Promise<SportResponse> => {
    return authFetch<SportResponse>(API_ENDPOINTS.SPORT, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};