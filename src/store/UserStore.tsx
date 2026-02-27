import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { User } from '../models/User';
import {
  getUserList,
  createUser as createUserApi,
  updateUserApi,
} from '../services/userService';
import { APP_STRINGS } from '../constants/AppStrings';

type CreateUserParams = {
  fullName: string;
  email: string;
  password: string;
  roleId: number;
};

type UpdateUserParams = {
  fullName?: string;
  email?: string;
  password?: string;
  roleId?: number;
  isActive?: boolean;
};

type UserContextType = {
  users: User[];
  loading: boolean;
  error: string | null;
  refreshUsers: () => Promise<void>;
  createUser: (params: CreateUserParams) => Promise<void>;
  updateUser: (userId: string, params: UpdateUserParams) => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedUsers = await getUserList();
      setUsers(fetchedUsers);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : APP_STRINGS.eventScreen.failedUserLoad,
      );
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  const createUser = useCallback(async (params: CreateUserParams) => {
    const created = await createUserApi(params);
    setUsers((prev) => [...prev, created]);
  }, []);

  const updateUser = useCallback(
    async (userId: string, params: UpdateUserParams) => {
      const updated = await updateUserApi(userId, params);
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? updated : user)),
      );
    },
    [],
  );

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        error,
        refreshUsers,
        createUser,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserStore = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUserStore must be used inside UserProvider');
  return ctx;
};
