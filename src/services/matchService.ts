import { FixtureResponse, MatchSetResponse, SetUpdateResponse } from '../models/ApiResponses';

const BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const getFixtures = async (
  catId: number,
  token: string,
  status?: string,
): Promise<FixtureResponse[]> => {
  const url = status
    ? `${BASE_URL}/categories/${catId}/fixtures?status=${status}`
    : `${BASE_URL}/categories/${catId}/fixtures`;
  const res = await fetch(url, { headers: getAuthHeaders(token) });
  return handleResponse<FixtureResponse[]>(res);
};

export const bulkScheduleFixtures = async (
  catId: number,
  schedules: Array<{ matchId: number; matchDateTime: string; totalSets: number }>,
  token: string,
): Promise<FixtureResponse[]> => {
  const res = await fetch(`${BASE_URL}/categories/${catId}/fixtures/schedule`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
    body: JSON.stringify(schedules),
  });
  return handleResponse<FixtureResponse[]>(res);
};

export const getMatchById = async (
  matchId: number,
  token: string,
): Promise<FixtureResponse> => {
  const res = await fetch(`${BASE_URL}/matches/${matchId}`, {
    headers: getAuthHeaders(token),
  });
  return handleResponse<FixtureResponse>(res);
};

export const getMatchSets = async (
  matchId: number,
  token: string,
): Promise<MatchSetResponse[]> => {
  const res = await fetch(`${BASE_URL}/matches/${matchId}/sets`, {
    headers: getAuthHeaders(token),
  });
  return handleResponse<MatchSetResponse[]>(res);
};

export const updateSetScore = async (
  matchId: number,
  payload: { scoreA: number; scoreB: number; isCompleted: boolean },
  token: string,
): Promise<SetUpdateResponse> => {
  const res = await fetch(`${BASE_URL}/matches/${matchId}/sets`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  });
  return handleResponse<SetUpdateResponse>(res);
};