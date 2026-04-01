import { Text, TouchableOpacity, View } from 'react-native';
import { useForgotPasswordViewModel } from '../../viewModels/ForgotPasswordViewModel';
import { ArrowLeft, Lock, Mail, Trophy } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import AppButton from '../../components/AppButton/AppButton';
import ScreenWrapper from '../../components/ScreenWrapper/ScreenWrapper';
import AppInput from '../../components/AppInput/AppInput';
import { styles } from './ForgotPasswordScreenStyles';
import { APP_STRINGS } from '../../constants/appStrings';
import { useEffect } from 'react';

const ForgotPasswordScreen = () => {
  const {
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
  } = useForgotPasswordViewModel();

  return (
    <ScreenWrapper scrollable={true}>
      <View style={styles.container}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headingContainer}>
          <View style={styles.trophyContainer}>
            <Trophy size={40} />
          </View>
          <View>
            <Text style={styles.headingText}>
              {APP_STRINGS.auth.resetPassword}
            </Text>
            <Text style={styles.subText}>
              {APP_STRINGS.auth.createNewPasswordTagline}
            </Text>
          </View>
        </View>

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
          disabled={!isFormValid || loading}
        />
      </View>
    </ScreenWrapper>
  );
};

export default ForgotPasswordScreen;
