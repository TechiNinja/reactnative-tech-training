import React from 'react';
import { Pressable, Text, View, Switch } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper/ScreenWrapper';
import { styles } from './UserFormScreenStyles';
import { APP_STRINGS } from '../../constants/appStrings';
import AppInput from '../../components/AppInput/AppInput';
import AppButton from '../../components/AppButton/AppButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { ArrowLeft, Check } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { useUserFormViewModel } from '../../viewModels/UserFormViewModel';

type UserFormScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'UserForm'
>;

const UserFormScreen = ({ route, navigation }: UserFormScreenProps) => {
  const { mode } = route.params;
  const userId = mode === 'edit' ? route.params.userId : undefined;

  const viewModel = useUserFormViewModel({
    mode,
    userId,
    navigation,
  });

  return (
    <ScreenWrapper scrollable withBottomSafeArea>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Pressable style={styles.iconContainer} onPress={viewModel.onBack}>
            <ArrowLeft size={25} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.heading}>
            {viewModel.isEdit
              ? APP_STRINGS.userScreen.editUser
              : APP_STRINGS.userScreen.createUser}
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabels}>{APP_STRINGS.labels.name}</Text>
          <AppInput
            placeholder={APP_STRINGS.placeHolders.fullName}
            value={viewModel.name}
            onChangeText={viewModel.setName}
            error={viewModel.errors.name}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabels}>{APP_STRINGS.labels.email}</Text>
          <AppInput
            placeholder={APP_STRINGS.placeHolders.email}
            value={viewModel.email}
            onChangeText={viewModel.setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={viewModel.errors.email}
            editable={!viewModel.isEdit}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabels}>{APP_STRINGS.labels.password}</Text>
          <AppInput
            placeholder={
              viewModel.isEdit
                ? APP_STRINGS.userScreen.newPasswordOptional
                : APP_STRINGS.placeHolders.enterPassword
            }
            value={viewModel.password}
            onChangeText={viewModel.setPassword}
            secureTextEntry
            error={viewModel.errors.password}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabels}>
            {APP_STRINGS.userScreen.assignRole}
          </Text>
          <View style={styles.roleOptions}>
            {viewModel.ROLES.map((role) => {
              const isSelected = viewModel.role === role.value;
              return (
                <Pressable
                  key={role.value}
                  onPress={() => viewModel.setRole(role.value)}
                  style={[
                    styles.roleOption,
                    isSelected && styles.roleOptionActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.roleOptionText,
                      isSelected && styles.roleOptionTextActive,
                    ]}
                  >
                    {role.label}
                  </Text>
                  {isSelected && <Check size={14} color={colors.primaryText} />}
                </Pressable>
              );
            })}
          </View>
        </View>

        {viewModel.isEdit && (
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleLabel}>
                {viewModel.isActive
                  ? APP_STRINGS.userScreen.activateUser
                  : APP_STRINGS.userScreen.deactivateUser}
              </Text>
              <Text style={styles.toggleSubtext}>
                {viewModel.isActive
                  ? APP_STRINGS.eventScreen.activeUserText
                  : APP_STRINGS.eventScreen.inactiveUserText}
              </Text>
            </View>
            <Switch
              value={viewModel.isActive}
              onValueChange={viewModel.toggleActive}
              trackColor={{
                false: colors.inputField,
                true: colors.participantBackgroud,
              }}
              thumbColor={colors.textPrimary}
            />
          </View>
        )}

        <AppButton
          title={
            viewModel.isEdit
              ? APP_STRINGS.userScreen.saveChanges
              : APP_STRINGS.userScreen.createUser
          }
          onPress={viewModel.onSubmit}
          disabled={viewModel.submitting}
        />
      </View>
    </ScreenWrapper>
  );
};

export default UserFormScreen;
