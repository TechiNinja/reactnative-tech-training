import { authFetch } from '../utils/authFetch';
import { API_ENDPOINTS } from '../config/api';
import { FixtureResponse, CategoryResponse } from '../models/ApiResponses';

export const getCategoryById = (categoryId: number) =>
  authFetch<CategoryResponse>(API_ENDPOINTS.CATEGORIES.BY_ID(categoryId));

export const generateFixtures = (categoryId: number) =>
  authFetch<FixtureResponse[]>(API_ENDPOINTS.CATEGORIES.GENERATE_FIXTURE(categoryId), {
    method: 'POST',
  });

export const getFixtures = (categoryId: number, status?: string) =>
  authFetch<FixtureResponse[]>(API_ENDPOINTS.CATEGORIES.GET_FIXTURES(categoryId, status));

export const bulkScheduleFixtures = (
  categoryId: number,
  schedules: Array<{ matchId: number; matchDateTime: string; totalSets: number }>,
) =>
  authFetch<FixtureResponse[]>(API_ENDPOINTS.CATEGORIES.BULK_SCHEDULE(categoryId), {
    method: 'PATCH',
    body: JSON.stringify(schedules),
  });

export const deleteFixtures = (categoryId: number) =>
  authFetch<void>(API_ENDPOINTS.CATEGORIES.DELETE_FIXTURES(categoryId), {
    method: 'DELETE',
  });

export const getParticipantsByCategory = (categoryId: number) =>
  authFetch<Array<{ id: number; userId: number; name: string; eventCategoryId: number; registeredAt: string }>>(
    API_ENDPOINTS.REGISTRATIONS.BY_CATEGORY(categoryId),
  );