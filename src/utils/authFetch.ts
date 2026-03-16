import { getToken } from './authStorage';
import { API_BASE_URL } from '../config/api';

export const authFetch = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const token = await getToken();
  const fullUrl = API_BASE_URL + url;

  console.log('AUTH FETCH ->', {
    url: fullUrl,
    method: options.method ?? 'GET',
    hasToken: !!token,
  });

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) {
    const rawText = await res.text();
    console.log('AUTH FETCH FAILED ->', {
      url: fullUrl,
      status: res.status,
      body: rawText,
    });

    let errData: any = {};
    try {
      errData = rawText ? JSON.parse(rawText) : {};
    } catch {}

    throw new Error(
      errData?.detail || errData?.title || rawText || `Failed: ${res.status}`,
    );
  }

  if (res.status === 204) return undefined as T;

  return (await res.json()) as T;
};