import { getToken } from './authStorage';
import { API_BASE_URL } from '../config/api';

export const authFetch = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const token = await getToken();

  try {
    const res = await fetch(API_BASE_URL + url, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers, ...(token && { Authorization: `Bearer ${token}` }) },
    });

    if (res.status === 204) return undefined as T;

    const data = await res.json();
    if (!res.ok) throw new Error(data?.detail || data?.title || `Failed request: ${res.status}`);

    return data as T;
  } catch (err) {
    throw err;
  }
};