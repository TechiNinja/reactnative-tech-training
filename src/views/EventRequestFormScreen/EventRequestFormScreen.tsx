import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { ArrowLeft, Check } from 'lucide-react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import ScreenWrapper from '../../components/ScreenWrapper/ScreenWrapper';
import AppInput from '../../components/AppInput/AppInput';
import AppButton from '../../components/AppButton/AppButton';

import { colors } from '../../theme/colors';
import { useEventRequestFormViewModel } from '../../viewModels/EventRequestFormViewModel';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { APP_STRINGS } from '../../constants/appStrings';
import { styles } from './EventRequestFormScreenStyles';


type Props = NativeStackScreenProps<RootStackParamList, 'EventRequestForm'>;

const EventRequestFormScreen = ({ route, navigation }: Props) => {
  const { mode, request } = route.params;

  const vm = useEventRequestFormViewModel({ mode, request, navigation });

  return (
    <ScreenWrapper scrollable withBottomSafeArea>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Pressable style={styles.iconContainer} onPress={vm.onBack}>
            <ArrowLeft size={25} color={colors.textPrimary} />
          </Pressable>

          <Text style={styles.heading}>{vm.screenTitle}</Text>
        </View>

        <Text style={styles.inputLabels}>
          {APP_STRINGS.RequestScreen.eventName}
        </Text>
        <AppInput
          placeholder={APP_STRINGS.placeHolders.eventName}
          value={vm.eventName}
          onChangeText={vm.setEventName}
          error={vm.errors.eventName}
        />

        <Text style={styles.inputLabels}>
          {APP_STRINGS.RequestScreen.sportsName}
        </Text>

        {vm.isEdit ? (
          <AppInput
            value={vm.selectedSportName}
            placeholder={APP_STRINGS.placeHolders.sportsName}
            editable={false}
            onChangeText={() => {}}
          />
        ) : (
          <>
            <Pressable onPress={vm.toggleSportList}>
              <View pointerEvents="none">
                <AppInput
                  placeholder={vm.sportPlaceholder}
                  value={vm.selectedSportName}
                  editable={false}
                  onChangeText={() => {}}
                  error={vm.errors.sportId}
                />
              </View>
            </Pressable>

            {vm.showSportList && (
              <View style={styles.sportListContainer}>
                {vm.sports.map((sport) => {
                  const isSelected = vm.sportId === sport.id;

                  return (
                    <Pressable
                      key={sport.id}
                      onPress={() => vm.onSelectSport(sport.id)}
                      style={[
                        styles.formatOption,
                        isSelected && styles.formatOptionActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.formatOptionText,
                          isSelected && styles.formatOptionTextActive,
                        ]}
                      >
                        {sport.name}
                      </Text>

                      {isSelected && (
                        <Check size={14} color={colors.primaryText} />
                      )}
                    </Pressable>
                  );
                })}
              </View>
            )}
          </>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabels}>
            {APP_STRINGS.RequestScreen.gender}
          </Text>
          <View style={styles.formatOptions}>
            {vm.genderOptions.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => vm.setGender(option.value)}
                style={[
                  styles.formatOption,
                  vm.gender === option.value && styles.formatOptionActive,
                ]}
              >
                <Text
                  style={[
                    styles.formatOptionText,
                    vm.gender === option.value && styles.formatOptionTextActive,
                  ]}
                >
                  {option.value}
                </Text>

                {vm.gender === option.value && (
                  <Check size={14} color={colors.primaryText} />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabels}>
            {APP_STRINGS.RequestScreen.formatRequired}
          </Text>
          <View style={styles.formatOptions}>
            {vm.formatOptions.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => vm.setFormat(option.value)}
                style={[
                  styles.formatOption,
                  vm.format === option.value && styles.formatOptionActive,
                ]}
              >
                <Text
                  style={[
                    styles.formatOptionText,
                    vm.format === option.value && styles.formatOptionTextActive,
                  ]}
                >
                  {option.value}
                </Text>

                {vm.format === option.value && (
                  <Check size={14} color={colors.primaryText} />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabels}>
              {APP_STRINGS.RequestScreen.startDateRequired}
            </Text>
            <Pressable onPress={vm.showStartPicker}>
              <View pointerEvents="none">
                <AppInput
                  placeholder={APP_STRINGS.placeHolders.date}
                  value={vm.startDate}
                  editable={false}
                  onChangeText={() => {}}
                  error={vm.errors.startDate}
                />
              </View>
            </Pressable>

            <DateTimePickerModal
              isVisible={vm.isStartPickerVisible}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'spinner'}
              date={vm.safeDateFromYmd(vm.startDate)}
              onConfirm={vm.onConfirmStartDate}
              onCancel={vm.hideStartPicker}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabels}>
              {APP_STRINGS.RequestScreen.endDateRequired}
            </Text>
            <Pressable onPress={vm.showEndPicker}>
              <View pointerEvents="none">
                <AppInput
                  placeholder={APP_STRINGS.placeHolders.date}
                  value={vm.endDate}
                  editable={false}
                  onChangeText={() => {}}
                  error={vm.errors.endDate}
                />
              </View>
            </Pressable>

            <DateTimePickerModal
              isVisible={vm.isEndPickerVisible}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'spinner'}
              date={vm.safeDateFromYmd(vm.endDate)}
              onConfirm={vm.onConfirmEndDate}
              onCancel={vm.hideEndPicker}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabels}>
            {APP_STRINGS.RequestScreen.venue}
          </Text>
          <AppInput
            placeholder={APP_STRINGS.placeHolders.venue}
            value={vm.requestedVenue}
            onChangeText={vm.setRequestedVenue}
            error={vm.errors.requestedVenue}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabels}>
            {APP_STRINGS.RequestScreen.logisticRequirements}
          </Text>
          <AppInput
            placeholder={APP_STRINGS.placeHolders.logisticRequirements}
            value={vm.logisticsRequirements}
            onChangeText={vm.setLogisticsRequirements}
          />
        </View>

        <AppButton
          title={vm.submitButtonTitle}
          onPress={vm.onSubmit}
          disabled={vm.submitting}
        />
      </View>
    </ScreenWrapper>
  );
};

export default EventRequestFormScreen;
