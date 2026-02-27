import { useState } from 'react';
import { User, UserRoleType } from '../models/User';
import { validationMessages } from '../constants/validationMessages';
import { useUserStore } from '../store/UserStore';
import { ROLE_TO_ID } from '../constants/roleIds';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Mode = 'create' | 'edit';

type UserFormParams = {
  mode: Mode;
  user?: User;
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

type UserFormErrors = {
  name?: string;
  email?: string;
  password?: string;
};

const ROLES: { value: UserRoleType; label: string }[] = [
  { value: 'participant', label: 'Participant' },
  { value: 'organizer', label: 'Organizer' },
  { value: 'operations', label: 'Ops Team' },
  { value: 'admin', label: 'Admin' },
];

export const useUserFormViewModel = ({
  mode,
  user,
  navigation,
}: UserFormParams) => {
  const { createUser, updateUser } = useUserStore();
  const isEdit = mode === 'edit' && !!user;

  const [name, setName] = useState(isEdit ? user!.name : '');
  const [email, setEmail] = useState(isEdit ? user!.email : '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRoleType>(
    isEdit ? user!.role : 'participant',
  );
  const [isActive, setIsActive] = useState(isEdit ? user!.isActive : true);
  const [errors, setErrors] = useState<UserFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: UserFormErrors = {};

    if (!name.trim()) {
      newErrors.name = validationMessages.REQUIRED_NAME;
    }

    if (!email.trim()) {
      newErrors.email = validationMessages.REQUIRED_EMAIL;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = validationMessages.INVALID_EMAIL;
    }

    if (!isEdit && !password.trim()) {
      newErrors.password = validationMessages.REQUIRED_PASSWORD;
    } else if (password && password.length < 8) {
      newErrors.password = validationMessages.PASSWORD_MIN_LENGTH;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    setErrors({});
    try {
      const roleId = ROLE_TO_ID[role];

      if (isEdit && user) {
        const payload: {
          fullName?: string;
          email?: string;
          password?: string;
          roleId?: number;
          isActive?: boolean;
        } = {
          fullName: name.trim(),
          email: email.trim().toLowerCase(),
          roleId,
          isActive,
        };
        if (password.trim()) {
          payload.password = password;
        }
        await updateUser(user.id, payload);
      } else {
        await createUser({
          fullName: name.trim(),
          email: email.trim().toLowerCase(),
          password: password.trim(),
          roleId,
        });
      }
      navigation.goBack();
    } catch (err) {
      setErrors({
        email: err instanceof Error ? err.message : 'Something went wrong',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const onBack = () => {
    navigation.goBack();
  };

  const toggleActive = () => {
    setIsActive((prev) => !prev);
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    role,
    setRole,
    isActive,
    toggleActive,
    isEdit,
    errors,
    submitting,
    onSubmit,
    onBack,
    ROLES,
  };
};
