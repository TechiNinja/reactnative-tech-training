import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  saveUser,
  getUser,
  clearStorage,
  StoredUser,
} from '../utils/authStorage';
import { Alert } from 'react-native';
import { API_ENDPOINTS } from '../config/api';
import { UserRoleType } from '../models/User';
import { APP_STRINGS } from '../constants/AppStrings';

type AuthContextType = {
  user: StoredUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    fullName: string,
    email: string,
    password: string,
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await getUser();
      setUser(storedUser);
      setLoading(false);
    };
    loadUser();
  }, []);

  const mapRole = (roles: string): UserRoleType => {
    const role = roles.toLowerCase();
    if (role === 'admin') return 'admin';
    if (role === 'organizer') return 'organizer';
    if (role === 'operations') return 'operations';
    return 'participant';
  };

  const register = async (
    fullName: string,
    email: string,
    password: string,
  ) => {
    try {
      const res = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        Alert.alert(
          APP_STRINGS.eventScreen.registrationFailed,
          data?.message ?? APP_STRINGS.eventScreen.somethingWentWrong,
        );
        return false;
      }

      const data = await res.json();
      const token = data.token;

      const userData: StoredUser = {
        id: data.id,
        name: data.fullName,
        email: data.email,
        role: mapRole(data.role),
      };

      setUser(userData);
      await saveUser(userData, token);
      return true;
    } catch {
      Alert.alert(
        APP_STRINGS.eventScreen.registrationFailed,
        APP_STRINGS.eventScreen.somethingWentWrong,
      );
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      const token = data.token;

      const userData: StoredUser = {
        id: data.id,
        name: data.fullName,
        email: data.email,
        role: mapRole(data.role),
      };

      setUser(userData);
      await saveUser(userData, token);
      return true;
    } catch {
      Alert.alert(
        APP_STRINGS.eventScreen.loginFailed,
        APP_STRINGS.eventScreen.somethingWentWrong,
      );
      return false;
    }
  };

  const logout = async () => {
    setUser(null);
    await clearStorage();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthStore = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthStore must be used inside AuthProvider');
  return ctx;
};
