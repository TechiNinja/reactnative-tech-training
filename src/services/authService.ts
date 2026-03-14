import { API_ENDPOINTS, API_BASE_URL } from '../config/api';
import { StoredUser } from '../utils/authStorage';
import { UserRoleType } from '../models/User';
import { APP_STRINGS } from '../constants/AppStrings';

type AuthApiResponse = {
  id: number;
  fullName: string;
  email: string;
  role: string;
  token: string;
};

const mapRole = (role: string): UserRoleType => {
  const normalized = role.toLowerCase();
  if (normalized === 'admin') return 'admin';
  if (normalized === 'organizer') return 'organizer';
  if (normalized === 'operations') return 'operations';
  return 'participant';
};

export const AuthService = {
  login: async (
    email: string,
    password: string,
  ): Promise<{ user: StoredUser; token: string } | null> => {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) return null;

    const data: AuthApiResponse = await res.json();
    const user: StoredUser = {
      id: data.id,
      name: data.fullName,
      email: data.email,
      role: mapRole(data.role),
    };

    return { user, token: data.token };
  },

  register: async (
    fullName: string,
    email: string,
    password: string,
  ): Promise<{ user: StoredUser; token: string }> => {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(
        data?.message ?? APP_STRINGS.eventScreen.registrationFailed,
      );
    }

    const data: AuthApiResponse = await res.json();
    const user: StoredUser = {
      id: data.id,
      name: data.fullName,
      email: data.email,
      role: mapRole(data.role),
    };

    return { user, token: data.token };
  },
};
