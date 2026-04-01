import { View, Text, Pressable } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper/ScreenWrapper';
import AppInput from '../../components/AppInput/AppInput';
import AppButton from '../../components/AppButton/AppButton';
import { ArrowLeft, Check } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { APP_STRINGS } from '../../constants/appStrings';
import { styles } from './EventRegistrationScreenStyles';
import { useEventRegistrationViewModel } from '../../viewModels/EventRegistrationViewModel';
import { FormatType, GenderType } from '../../models/Event';

type EventRegistrationProps = NativeStackScreenProps<RootStackParamList, 'EventRegister'>;

const EventRegistrationScreen = ({ navigation, route }: EventRegistrationProps) => {
  const viewModel = useEventRegistrationViewModel(navigation, route);
  const formatOptions: FormatType[] = viewModel.availableFormats;

  return (
    <ScreenWrapper scrollable>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Pressable onPress={viewModel.onBack}>
            <ArrowLeft size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.heading}>
            {APP_STRINGS.eventScreen.registerForEvent}
          </Text>
        </View>

        <Text style={styles.label}>{APP_STRINGS.placeHolders.playerName}</Text>
        <AppInput
          placeholder={APP_STRINGS.placeHolders.fullName}
          value={viewModel.playerName}
          onChangeText={viewModel.setPlayerName}
          editable={false}
        />

        <Text style={styles.label}>{APP_STRINGS.placeHolders.gender}</Text>
        <View style={styles.formatContainer}>
          {[GenderType.Male, GenderType.Female].map((item) => {
            const isActive = viewModel.gender === item;
            const isLocked =
              viewModel.myRegisteredGender !== null &&
              viewModel.myRegisteredGender !== item;

            return (
              <Pressable
                key={item}
                onPress={() => viewModel.setGender(item)}
                disabled={isLocked}
                style={[
                  styles.formatTab,
                  isActive && styles.activeFormatTab,
                  isLocked && styles.formatOptionCardDisabled,
                ]}
              >
                <Text style={[styles.formatText, isActive && styles.activeFormatText]}>
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>{APP_STRINGS.eventScreen.selectFormats}</Text>
        <Text style={styles.subLabel}>{APP_STRINGS.eventScreen.chooseFormat}</Text>

        <View style={styles.formatSelectionContainer}>
          {formatOptions.map((format) => {
            const isSelected = viewModel.selectedFormats.includes(format);
            const isFull =
              viewModel.gender !== '' &&
              viewModel.isCategoryFull(viewModel.gender, format);
            const alreadyRegistered =
              viewModel.gender !== '' &&
              viewModel.isAlreadyRegistered(viewModel.gender, format);
            const count =
              viewModel.gender !== ''
                ? viewModel.getCategoryCount(viewModel.gender, format)
                : 0;

            return (
              <Pressable
                key={format}
                onPress={() => viewModel.toggleFormat(format)}
                style={[
                  styles.formatOptionCard,
                  isSelected && styles.formatOptionCardActive,
                  (isFull || alreadyRegistered) && styles.formatOptionCardDisabled,
                ]}
              >
                <View style={styles.formatOptionContent}>
                  <View style={styles.formatTitleRow}>
                    <Text
                      style={[
                        styles.formatOptionTitle,
                        (isFull || alreadyRegistered) && styles.formatOptionTitleDisabled,
                      ]}
                    >
                      {format}
                    </Text>
                    {alreadyRegistered && (
                      <Text style={styles.fullBadge}>{APP_STRINGS.registrationScreen.registeredBadge}</Text>
                    )}
                    {!alreadyRegistered && isFull && (
                      <Text style={styles.fullBadge}>{APP_STRINGS.eventScreen.full}</Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.formatOptionDesc,
                      (isFull || alreadyRegistered) && styles.formatOptionDescDisabled,
                    ]}
                  >
                    {format === FormatType.Singles
                      ? APP_STRINGS.eventScreen.individualMatches
                      : APP_STRINGS.eventScreen.teamOfPlayers}
                  </Text>
                  {viewModel.gender !== '' && (
                    <Text style={[styles.slotsText, isFull && styles.slotsTextFull]}>
                      {count}/{viewModel.totalSlotsPerCategory} slots filled
                    </Text>
                  )}
                </View>
                {isSelected && !isFull && !alreadyRegistered && (
                  <View style={styles.checkIcon}>
                    <Check size={16} color={colors.primaryText} />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.buttonContainer}>
          <AppButton
            title={
              viewModel.isAlreadyFullyRegistered
                ? APP_STRINGS.registrationScreen.alreadyRegistered
                : APP_STRINGS.eventScreen.register
            }
            onPress={viewModel.onRegister}
            disabled={!viewModel.isFormValid || viewModel.isAlreadyFullyRegistered}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default EventRegistrationScreen;