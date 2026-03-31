import React from 'react';
import { Pressable, Text, View } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper/ScreenWrapper';
import { styles } from './EventFormScreenStyles';
import { APP_STRINGS } from '../../constants/appStrings';
import AppInput from '../../components/AppInput/AppInput';
import AppButton from '../../components/AppButton/AppButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { ArrowLeft, Check } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { useEventFormViewModel } from '../../viewModels/EventFormViewModel';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { FormatType } from '../../models/Event';

type EventFormScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'EventForm'
>;

const EventFormScreen = ({ route }: EventFormScreenProps) => {
  const { mode, event } = route.params;

  const viewModel = useEventFormViewModel({
    mode,
    event,
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
              ? APP_STRINGS.eventScreen.editEvent
              : APP_STRINGS.eventScreen.createEvent}
          </Text>
        </View>

        <Text style={styles.inputLabels}>
          {APP_STRINGS.eventScreen.eventName}
        </Text>
        <AppInput
          placeholder={APP_STRINGS.eventScreen.eventName}
          value={viewModel.name}
          onChangeText={viewModel.setName}
          error={viewModel.errors.name}
        />

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabels}>
            {APP_STRINGS.eventScreen.sportName}
          </Text>
          <AppInput
            placeholder={APP_STRINGS.eventScreen.sportName}
            value={viewModel.sport}
            onChangeText={viewModel.onSportChange}
            error={viewModel.errors.sport}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabels}>
            {APP_STRINGS.eventScreen.format}
          </Text>
          <View style={styles.formatOptions}>
            {[FormatType.Singles, FormatType.Doubles].map((fmt) => {
              const isSelected = viewModel.selectedFormats.includes(fmt);
              const isDisabled =
                viewModel.sport.toLowerCase() === 'chess' &&
                fmt === FormatType.Doubles;
              return (
                <Pressable
                  key={fmt}
                  onPress={() => !isDisabled && viewModel.toggleFormat(fmt)}
                  style={[
                    styles.formatOption,
                    isSelected && styles.formatOptionActive,
                    isDisabled && styles.formatOptionDisabled,
                  ]}
                >
                  <Text
                    style={[
                      styles.formatOptionText,
                      isSelected && styles.formatOptionTextActive,
                    ]}
                  >
                    {fmt}
                  </Text>
                  {isSelected && <Check size={14} color={colors.primaryText} />}
                </Pressable>
              );
            })}
          </View>
          {viewModel.errors.formats && (
            <Text style={styles.errorText}>{viewModel.errors.formats}</Text>
          )}
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabels}>
              {APP_STRINGS.eventScreen.date}
            </Text>
            <Pressable onPress={viewModel.showDatePicker}>
              <View pointerEvents="none">
                <AppInput
                  placeholder={APP_STRINGS.eventScreen.date}
                  value={viewModel.date}
                  editable={false}
                  onChangeText={() => {}}
                />
              </View>
            </Pressable>

            <DateTimePickerModal
              isVisible={viewModel.isDatePickerVisible}
              mode="date"
              display="inline"
              date={viewModel.date ? new Date(viewModel.date) : new Date()}
              onConfirm={viewModel.handleConfirmDate}
              onCancel={viewModel.hideDatePicker}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabels}>
              {APP_STRINGS.eventScreen.time}
            </Text>
            <Pressable onPress={viewModel.showTimePicker}>
              <View pointerEvents="none">
                <AppInput
                  placeholder={APP_STRINGS.eventScreen.time}
                  value={viewModel.time}
                  editable={false}
                  onChangeText={() => {}}
                />
              </View>
            </Pressable>

            <DateTimePickerModal
              isVisible={viewModel.isTimePickerVisible}
              mode="time"
              date={new Date()}
              display="spinner"
              onConfirm={viewModel.handleConfirmTime}
              onCancel={viewModel.hideTimePicker}
            />
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabels}>
              {APP_STRINGS.eventScreen.venue}
            </Text>
            <AppInput
              placeholder={APP_STRINGS.eventScreen.venue}
              value={viewModel.venue}
              onChangeText={viewModel.setVenue}
              error={viewModel.errors.venue}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabels}>
              {APP_STRINGS.eventScreen.totalParticipants}
            </Text>
            <AppInput
              placeholder={APP_STRINGS.eventScreen.totalParticipants}
              value={viewModel.totalTeams}
              onChangeText={viewModel.setTotalTeams}
              keyboardType="number-pad"
              error={viewModel.errors.totalTeams}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabels}>
            {APP_STRINGS.eventScreen.description}
          </Text>
          <AppInput
            placeholder={APP_STRINGS.eventScreen.description}
            value={viewModel.description}
            onChangeText={viewModel.setDescription}
            error={viewModel.errors.description}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabels}>
            {APP_STRINGS.eventScreen.rulesAndRegulations}
          </Text>
          <AppInput
            placeholder={APP_STRINGS.placeHolders.rules}
            value={viewModel.rulesText}
            onChangeText={viewModel.setRulesText}
            error={viewModel.errors.rules}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabels}>
            {APP_STRINGS.eventScreen.prizeForFirst}
          </Text>
          <AppInput
            placeholder={APP_STRINGS.placeHolders.prizeForFirst}
            value={viewModel.firstPrize}
            onChangeText={viewModel.setFirstPrize}
            error={viewModel.errors.totalTeams}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabels}>
            {APP_STRINGS.eventScreen.prizeForSecond}
          </Text>
          <AppInput
            placeholder={APP_STRINGS.placeHolders.prizeForSecond}
            value={viewModel.secondPrize}
            onChangeText={viewModel.setSecondPrize}
            error={viewModel.errors.totalTeams}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabels}>
            {APP_STRINGS.eventScreen.prizeForThird}
          </Text>
          <AppInput
            placeholder={APP_STRINGS.placeHolders.prizeForThird}
            value={viewModel.thirdPrize}
            onChangeText={viewModel.setThirdPrize}
            error={viewModel.errors.totalTeams}
          />
        </View>

        <AppButton
          title={
            viewModel.isEdit
              ? APP_STRINGS.eventScreen.saveChanges
              : APP_STRINGS.eventScreen.createEvent
          }
          onPress={viewModel.onSubmit}
        />
      </View>
    </ScreenWrapper>
  );
};

export default EventFormScreen;
