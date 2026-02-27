import { API_ENDPOINTS } from '../config/api';
import { getToken } from '../utils/authStorage';

const authFetch = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const token = await getToken();
  const headers = {
    ...(options.headers || {}),
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    throw new Error(`Failed request: ${res.status}`);
  }
  return res.json() as Promise<T>;
};

export const OrganizerService = {
  createTeams: (eventCategoryId: number) =>
    authFetch(API_ENDPOINTS.ORGANIZER.CREATE_TEAMS, {
      method: 'POST',
      body: JSON.stringify({ eventCategoryId }),
    }),
};
