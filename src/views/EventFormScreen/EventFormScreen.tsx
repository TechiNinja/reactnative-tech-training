import React from 'react';
import { Pressable, Text, View } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper/ScreenWrapper';
import { styles } from './EventFormScreenStyles';
import { APP_STRINGS } from '../../constants/AppStrings';
import AppInput from '../../components/AppInput/AppInput';
import AppButton from '../../components/AppButton/AppButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { ArrowLeft } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { useEventFormViewModel } from '../../viewModels/EventFormViewModel';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

type EventFormScreenProps = NativeStackScreenProps<RootStackParamList, 'EventForm'>;

const EventFormScreen = ({ route }: EventFormScreenProps) => {
  const { mode, eventRequest, event } = route.params;

  const viewModel = useEventFormViewModel({ mode, eventRequest, event });

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
          placeholder={APP_STRINGS.placeHolders.eventName}
          value={viewModel.name}
          onChangeText={viewModel.setName}
          error={viewModel.errors.name}
        />

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabels}>
            {APP_STRINGS.eventScreen.sportName}
          </Text>
          <AppInput
            placeholder={APP_STRINGS.placeHolders.sportsName}
            value={viewModel.sport}
            editable={false}
            onChangeText={() => {}}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabels}>
            {APP_STRINGS.eventScreen.venue}
          </Text>
          <AppInput
            placeholder={APP_STRINGS.placeHolders.venue}
            value={viewModel.venue}
            editable={false}
            onChangeText={() => {}}
          />
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabels}>
              {APP_STRINGS.RequestScreen.startDate}
            </Text>
            <AppInput
              placeholder={APP_STRINGS.placeHolders.date}
              value={viewModel.startDate}
              editable={false}
              onChangeText={() => {}}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabels}>
              {APP_STRINGS.RequestScreen.endDate}
            </Text>
            <AppInput
              placeholder={APP_STRINGS.placeHolders.date}
              value={viewModel.endDate}
              editable={false}
              onChangeText={() => {}}
            />
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabels}>
              {APP_STRINGS.RequestScreen.gender}
            </Text>
            <AppInput
              placeholder="Gender"
              value={viewModel.gender}
              editable={false}
              onChangeText={() => {}}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabels}>
              {APP_STRINGS.RequestScreen.format}
            </Text>
            <AppInput
              placeholder="Format"
              value={viewModel.format}
              editable={false}
              onChangeText={() => {}}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabels}>
            {APP_STRINGS.eventScreen.registrationDeadline}
          </Text>
          <Pressable onPress={viewModel.showDeadlinePicker}>
            <View pointerEvents="none">
              <AppInput
                placeholder={APP_STRINGS.placeHolders.registrationDeadline}
                value={viewModel.registrationDeadline}
                editable={false}
                onChangeText={() => {}}
                error={viewModel.errors.registrationDeadline}
              />
            </View>
          </Pressable>
          <DateTimePickerModal
            isVisible={viewModel.isDeadlinePickerVisible}
            mode="date"
            display="inline"
            date={
              viewModel.registrationDeadline
                ? new Date(viewModel.registrationDeadline)
                : new Date()
            }
            onConfirm={viewModel.handleConfirmDeadline}
            onCancel={viewModel.hideDeadlinePicker}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabels}>
            {APP_STRINGS.eventScreen.totalParticipants}
          </Text>
          <AppInput
            placeholder={APP_STRINGS.eventScreen.totalParticipants}
            value={viewModel.maxParticipantsCount}
            onChangeText={viewModel.setMaxParticipantsCount}
            keyboardType="number-pad"
            error={viewModel.errors.maxParticipantsCount}
          />
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

        <AppButton
          title={
            viewModel.isEdit
              ? APP_STRINGS.eventScreen.saveChanges
              : APP_STRINGS.eventScreen.createEvent
          }
          onPress={viewModel.onSubmit}
          disabled={viewModel.submitting}
        />

        {viewModel.isEdit && (
          <AppButton
            title={APP_STRINGS.eventScreen.deleteEvent}
            onPress={viewModel.onDelete}
            disabled={viewModel.submitting}
          />
        )}
      </View>
    </ScreenWrapper>
  );
};

export default EventFormScreen;