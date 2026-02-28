import { useState } from 'react';
import { isValidEmail, isValidPassword } from '../utils/validation';
import { validationMessages } from '../constants/validationMessages';

export const useForgotPasswordViewModel = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  const onSubmitPress = (): boolean => {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmValid = validateConfirmPassword();

    if (!isEmailValid || !isPasswordValid || !isConfirmValid) {
      return false;
    }

    setSuccessMessage(validationMessages.PASSWORD_UPDATED);
    return true;
  };

  const isFormValid =
    email.length > 0 &&
    isValidEmail(email) &&
    newPassword.length >= 8 &&
    confirmPassword === newPassword &&
    isValidPassword(newPassword) &&
    isValidPassword(confirmPassword);

  return {
    email,
    newPassword,
    confirmPassword,
    emailError,
    passwordError,
    confirmPasswordError,
    successMessage,
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
