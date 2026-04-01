import { useState } from 'react';
import { isValidEmail, isValidPassword } from '../utils/validation';
import { validationMessages } from '../constants/validationMessages';
import { useAuthStore } from '../store/AuthStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

export const useLoginViewModel = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (): boolean => {
    if (!email.trim()) {
      setEmailError(validationMessages.REQUIRED_EMAIL);
      return false;
    } else if (!isValidEmail(email)) {
      setEmailError(validationMessages.INVALID_EMAIL);
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  const validatePassword = (): boolean => {
    if (!password.trim()) {
      setPasswordError(validationMessages.REQUIRED_PASSWORD);
      return false;
    } else if (!isValidPassword(password)) {
      setPasswordError(validationMessages.INVALID_PASSWORD);
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };

  const handleLogin = async () => {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (!isEmailValid || !isPasswordValid) return;

    const loggedInUser = await login(email, password);

    if (!loggedInUser) {
      setPasswordError(validationMessages.INVALID_CREDENTIALS);
      return;
    }

    switch (loggedInUser.role) {
      case 'admin':
        navigation.reset({
          index: 0,
          routes: [{ name: 'AdminTabs' }],
        });
        break;

      case 'organizer':
        navigation.reset({
          index: 0,
          routes: [{ name: 'OrganizerTabs' }],
        });
        break;

      case 'participant':
        navigation.reset({
          index: 0,
          routes: [{ name: 'ParticipantTabs' }],
        });
        break;

      case 'operations':
        navigation.reset({
          index: 0,
          routes: [{ name: 'OperationTabs' }],
        });
        break;  
    }
  };

  const goToRegister = () => {
    navigation.navigate('Auth', { screen: 'Register' });
  };

  const goToForgotPassword = () => {
    navigation.navigate('Auth', { screen: 'ForgotPassword' });
  };

  const isFormValid =
    email.length > 0 &&
    password.length > 0 &&
    isValidEmail(email) &&
    isValidPassword(password);

  return {
    email,
    password,
    setEmail,
    setPassword,
    emailError,
    passwordError,
    validateEmail,
    validatePassword,
    handleLogin,
    isFormValid,
    goToRegister,
    goToForgotPassword,
  };
};
