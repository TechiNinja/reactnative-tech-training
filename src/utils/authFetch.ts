import { getToken } from './authStorage';
import { API_BASE_URL } from '../config/api';

export const authFetch = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const token = await getToken();

  const headers = {
    ...(options.headers || {}),
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };

  const res = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message =
      (errorData as { message?: string })?.message ??
      `Failed request: ${res.status}`;
    throw new Error(message);
  }

  return res.json() as Promise<T>;
};