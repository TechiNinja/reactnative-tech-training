import { User, UserRoleType } from '../models/User';
import { ID_TO_ROLE } from '../constants/roleIds';
import { authFetch } from '../utils/authFetch';

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
  'operations team': 'operations',
  opsteam: 'operations',
  ops: 'operations',
};

const normalizeRole = (role: string): UserRoleType => {
  const normalized = role.trim().toLowerCase();
  return roleMap[normalized] ?? 'participant';
};

export const getUserList = async (): Promise<User[]> => {
  const data = await authFetch<ApiUser[] | { users: ApiUser[] }>('/Users');
  const users = Array.isArray(data)
    ? data
    : (data as { users: ApiUser[] }).users;
  return (users ?? []).map(mapApiUserToUser);
};

export const getUserById = async (userId: string): Promise<User> => {
  const apiUser = await authFetch<ApiUser>(`/Users/${userId}`);
  return mapApiUserToUser(apiUser);
};

export const createUser = async (payload: CreateUserPayload): Promise<User> => {
  const created = await authFetch<ApiUser>('/Users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return mapApiUserToUser(created);
};

export const updateUserApi = async (
  userId: string,
  payload: UpdateUserPayload,
): Promise<User> => {
  const updated = await authFetch<ApiUser>(`/Users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return mapApiUserToUser(updated);
};
