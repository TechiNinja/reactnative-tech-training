import { Alert, Text, View } from 'react-native';
import { useForgotPasswordViewModel } from '../../viewModels/ForgotPasswordViewModel';
import { Lock, Mail, Trophy } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import AppButton from '../../components/AppButton/AppButton';
import ScreenWrapper from '../../components/ScreenWrapper/ScreenWrapper';
import AppInput from '../../components/AppInput/AppInput';
import { styles } from './ForgotPasswordScreenStyles';
import { APP_STRINGS } from '../../constants/AppStrings';
import { useEffect } from 'react';
import { validationMessages } from '../../constants/validationMessages';

const ForgotPasswordScreen = () => {
  const {
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
  } = useForgotPasswordViewModel();

  useEffect(() => {
    if (successMessage) {
      Alert.alert(
        validationMessages.PASSWORD_UPDATED,
        validationMessages.PASSWORD_UPDATED_DESCRIPTION,
      );
    }
  }, [successMessage]);

  return (
    <ScreenWrapper scrollable={true}>
      <View style={styles.container}>
        <View style={styles.headingContainer}>
          <View style={styles.trophyContainer}>
            <Trophy size={40} />
          </View>
          <Text style={styles.headingText}>
            {APP_STRINGS.auth.resetPassword}
          </Text>
        </View>

        <Text style={styles.subText}>
          {APP_STRINGS.auth.createNewPasswordTagline}
        </Text>

        <Text style={styles.inputLabel}>{APP_STRINGS.labels.email}</Text>
        <AppInput
          icon={<Mail size={20} color={colors.textSecondary} />}
          placeholder={APP_STRINGS.placeHolders.email}
          value={email}
          onChangeText={setEmail}
          onBlur={validateEmail}
          error={emailError}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.inputLabel}>{APP_STRINGS.labels.newPassword}</Text>
        <AppInput
          icon={<Lock size={20} color={colors.textSecondary} />}
          placeholder={APP_STRINGS.placeHolders.newPassword}
          value={newPassword}
          onChangeText={setNewPassword}
          onBlur={validatePassword}
          secureTextEntry
          error={passwordError}
        />

        <Text style={styles.inputLabel}>
          {APP_STRINGS.labels.confirmPassword}
        </Text>
        <AppInput
          icon={<Lock size={20} color={colors.textSecondary} />}
          placeholder={APP_STRINGS.placeHolders.confirmNewPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          onBlur={validateConfirmPassword}
          secureTextEntry
          error={confirmPasswordError}
        />

        <AppButton
          title={APP_STRINGS.buttons.updatePassword}
          onPress={onSubmitPress}
          disabled={!isFormValid}
        />
      </View>
    </ScreenWrapper>
  );
};

export default ForgotPasswordScreen;