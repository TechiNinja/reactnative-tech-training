import { getToken } from './authStorage';
import { API_BASE_URL } from '../config/api';

export const authFetch = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const token = await getToken();

  const headers = {
    ...(options.headers || {}),
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const finalUrl = `${API_BASE_URL}${url}`;
  console.log('FINAL URL =>', finalUrl);

  const res = await fetch(finalUrl, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.log('ERROR BODY =>', errorData);

    const message =
      (errorData as { detail?: string; title?: string })?.detail ||
      (errorData as { detail?: string; title?: string })?.title ||
      `Failed request: ${res.status}`;

    throw new Error(message);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
};