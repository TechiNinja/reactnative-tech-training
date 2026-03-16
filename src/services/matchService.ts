import { authFetch } from '../utils/authFetch';
import { API_ENDPOINTS } from '../config/api';
import { FixtureResponse, MatchSetResponse, SetUpdateResponse } from '../models/ApiResponses';

export const getMatchById = (matchId: number) =>
  authFetch<FixtureResponse>(API_ENDPOINTS.MATCHES.BY_ID(matchId));

export const getMatchSets = (matchId: number) =>
  authFetch<MatchSetResponse[]>(API_ENDPOINTS.MATCHES.SETS(matchId));

export const updateSetById = (
  matchId: number,
  setId: number,
  payload: { scoreA: number; scoreB: number; isCompleted: boolean },
) =>
  authFetch<SetUpdateResponse>(API_ENDPOINTS.MATCHES.SET_BY_ID(matchId, setId), {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

export const updateSetScore = (
  matchId: number,
  payload: { scoreA: number; scoreB: number; isCompleted: boolean },
) =>
  authFetch<SetUpdateResponse>(API_ENDPOINTS.MATCHES.SETS(matchId), {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });