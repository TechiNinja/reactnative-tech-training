import { useState } from 'react';
import { Alert } from 'react-native';
import { isValidEmail, isValidPassword } from '../utils/validation';
import { validationMessages } from '../constants/validationMessages';
import { AuthService } from '../services/authService';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { APP_STRINGS } from '../constants/appStrings';

export const useForgotPasswordViewModel = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (): boolean => {
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

  const validatePassword = (): boolean => {
    if (!newPassword) {
      setPasswordError(validationMessages.REQUIRED_PASSWORD);
      return false;
    } else if (newPassword.length < 8) {
      setPasswordError(validationMessages.PASSWORD_MIN_LENGTH);
      return false;
    } else if (!isValidPassword(newPassword)) {
      setPasswordError(validationMessages.INVALID_PASSWORD);
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (): boolean => {
    if (!confirmPassword) {
      setConfirmPasswordError(validationMessages.CONFIRM_PASSWORD);
      return false;
    } else if (confirmPassword !== newPassword) {
      setConfirmPasswordError(validationMessages.PASSWORD_MISMATCH);
      return false;
    } else if (!isValidPassword(confirmPassword)) {
      setConfirmPasswordError(validationMessages.INVALID_PASSWORD);
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const onSubmitPress = async (): Promise<void> => {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmValid = validateConfirmPassword();

    if (!isEmailValid || !isPasswordValid || !isConfirmValid) return;

    setLoading(true);
    try {
      await AuthService.forgotPassword(email, newPassword);
      Alert.alert(
        validationMessages.PASSWORD_UPDATED,
        validationMessages.PASSWORD_UPDATED_DESCRIPTION,
        [
          {
            text: 'Ok',
            onPress: () => navigation.navigate('Auth', { screen: 'Login' }),
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : APP_STRINGS.auth.somethingWentWrong,
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    email.length > 0 &&
    isValidEmail(email) &&
    newPassword.length >= 8 &&
    confirmPassword === newPassword &&
    isValidPassword(newPassword) &&
    isValidPassword(confirmPassword);

  const goBack = () => navigation.goBack();

  return {
    email,
    newPassword,
    confirmPassword,
    emailError,
    passwordError,
    confirmPasswordError,
    loading,
    goBack,
    setEmail,
    setNewPassword,
    setConfirmPassword,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    onSubmitPress,
    isFormValid,
  };
};
