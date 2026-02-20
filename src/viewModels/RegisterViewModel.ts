import { useState } from 'react';
import {
  isValidEmail,
  isValidName,
  isValidPassword,
} from '../utils/validation';
import { validationMessages } from '../constants/ValidationMessages';
import { useAuthStore } from '../store/AuthStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

export const useRegisterViewModel = (
  navigation: NativeStackNavigationProp<RootStackParamList>,
) => {
  const { register } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateName = () => {
    if (!name.trim()) {
      setNameError(validationMessages.REQUIRED_NAME);
      return false;
    } else if (!isValidName(name)) {
      setNameError(validationMessages.NAME_ALPHA_ONLY);
      return false;
    }
    setNameError('');
    return true;
  };

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError(validationMessages.REQUIRED_EMAIL);
      return false;
    } else if (!isValidEmail(email)) {
      setEmailError(validationMessages.INVALID_EMAIL);
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = () => {
    if (!password.trim()) {
      setPasswordError(validationMessages.REQUIRED_PASSWORD);
      return false;
    } else if (!isValidPassword(password)) {
      setPasswordError(validationMessages.INVALID_PASSWORD);
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleRegister = async () => {
    const valid = validateName() && validateEmail() && validatePassword();
    if (!valid) return;

    const success = await register(name, email, password);

    if (success) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'ParticipantTabs' }],
      });
    }
  };

  const goToLogin = () => {
    navigation.navigate('Auth', { screen: 'Login' });
  };

  const isFormValid =
    name.length > 0 &&
    isValidName(name) &&
    email.length > 0 &&
    isValidEmail(email) &&
    password.length > 0 &&
    isValidPassword(password);

  return {
    name,
    email,
    password,
    setName,
    setEmail,
    setPassword,
    nameError,
    emailError,
    passwordError,
    validateName,
    validateEmail,
    validatePassword,
    handleRegister,
    goToLogin,
    isFormValid,
  };
};
