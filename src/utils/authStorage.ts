import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserRoleType } from '../models/User';

const USER_KEY = 'user';
const TOKEN_KEY = 'jwtToken';

export type StoredUser = {
  id: number;
  name: string;
  email: string;
  role: UserRoleType;
};

export const saveUser = async (user: StoredUser, token: string) => {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const getUser = async (): Promise<StoredUser | null> => {
  const data = await AsyncStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const getToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(TOKEN_KEY);
};

export const clearStorage = async () => {
  await AsyncStorage.removeItem(USER_KEY);
  await AsyncStorage.removeItem(TOKEN_KEY);
};
