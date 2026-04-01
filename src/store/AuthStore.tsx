import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  saveUser,
  getUser,
  clearStorage,
  StoredUser,
} from '../utils/authStorage';
import { Alert } from 'react-native';
import { APP_STRINGS } from '../constants/AppStrings';
import { AuthService } from '../services/authService';

type AuthContextType = {
  user: StoredUser | null;
  login: (email: string, password: string) => Promise<StoredUser | null>;
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

  const register = async (
    fullName: string,
    email: string,
    password: string,
  ) => {
    try {
      const result = await AuthService.register(fullName, email, password);
      await saveUser(result.user, result.token);
      setUser(result.user);
      return true;
    } catch (error) {
      Alert.alert(
        APP_STRINGS.eventScreen.registrationFailed,
        error instanceof Error
          ? error.message
          : APP_STRINGS.auth.somethingWentWrong,
      );
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await AuthService.login(email, password);
      if (!result) return null;
      await saveUser(result.user, result.token);
      setUser(result.user);
      return result.user;
    } catch {
      Alert.alert(
        APP_STRINGS.auth.loginFailed,
        APP_STRINGS.auth.somethingWentWrong,
      );
      return null;
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
