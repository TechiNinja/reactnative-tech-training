import { getToken } from '../utils/authStorage';
import { User, UserRoleType } from '../models/User';
import { ID_TO_ROLE } from '../constants/roleIds';
import { API_BASE_URL } from '../config/api';

type ApiUser = {
  id: string | number;
  fullName?: string;
  name?: string;
  email: string;
  roleId?: number;
  role?: string;
  isActive?: boolean;
};

type CreateUserPayload = {
  fullName: string;
  email: string;
  password: string;
  roleId: number;
};

type UpdateUserPayload = {
  fullName?: string;
  email?: string;
  password?: string;
  roleId?: number;
  isActive?: boolean;
};

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

  const res = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message =
      (errorData as { message?: string })?.message ??
      `Failed request: ${res.status}`;
    throw new Error(message);
  }

  return res.json() as Promise<T>;
};

const mapApiUserToUser = (apiUser: ApiUser): User => {
  const name = apiUser.fullName ?? apiUser.name ?? '';
  const role =
    apiUser.roleId !== undefined
      ? ID_TO_ROLE[apiUser.roleId] ?? 'participant'
      : normalizeRole(apiUser.role ?? '');
  return {
    id: String(apiUser.id),
    name,
    email: apiUser.email,
    role,
    isActive: apiUser.isActive ?? true,
  };
};

const roleMap: Record<string, UserRoleType> = {
  admin: 'admin',
  organizer: 'organizer',
  participant: 'participant',
  operations: 'operations',
  ops: 'operations',
};

const normalizeRole = (role: string): UserRoleType => {
  const normalized = role.toLowerCase();
  return roleMap[normalized] ?? 'participant';
};

export const getUserList = async (): Promise<User[]> => {
  const data = await authFetch<ApiUser[] | { users: ApiUser[] }>('/users');
  const users = Array.isArray(data)
    ? data
    : (data as { users: ApiUser[] }).users;
  return (users ?? []).map(mapApiUserToUser);
};

export const getUserById = async (userId: string): Promise<User> => {
  const apiUser = await authFetch<ApiUser>(`/users/${userId}`);
  return mapApiUserToUser(apiUser);
};

export const createUser = async (payload: CreateUserPayload): Promise<User> => {
  const created = await authFetch<ApiUser>('/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return mapApiUserToUser(created);
};

export const updateUserApi = async (
  userId: string,
  payload: UpdateUserPayload,
): Promise<User> => {
  const updated = await authFetch<ApiUser>(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return mapApiUserToUser(updated);
};
