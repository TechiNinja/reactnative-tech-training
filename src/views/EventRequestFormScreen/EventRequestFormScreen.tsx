import React, { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper/ScreenWrapper';
import AppInput from '../../components/AppInput/AppInput';
import AppButton from '../../components/AppButton/AppButton';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { ArrowLeft, Check } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { styles } from './EventRequestFormScreenStyles';
import { useEventRequestFormViewModel } from '../../viewModels/EventRequestFormViewModel';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { APP_STRINGS } from '../../constants/AppStrings';

type Props = NativeStackScreenProps<RootStackParamList, 'EventRequestForm'>;

const safeDateFromYmd = (ymd?: string) => {
  if (!ymd) return new Date();
  const parts = ymd.split('-').map(Number);
  const y = parts[0];
  const m = parts[1];
  const d = parts[2];
  if (!y || !m || !d) return new Date();
  return new Date(y, m - 1, d);
};

const EventRequestFormScreen = ({ route, navigation }: Props) => {
  const { mode, request } = route.params;

  const vm = useEventRequestFormViewModel({ mode, request, navigation });

  const [showSportList, setShowSportList] = useState(false);

  const selectedSportName = vm.isEdit
    ? request?.sportsName ?? ''
    : vm.sports.find((s) => s.id === vm.sportId)?.name ?? '';

  return (
    <ScreenWrapper scrollable withBottomSafeArea>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Pressable style={styles.iconContainer} onPress={vm.onBack}>
            <ArrowLeft size={25} color={colors.textPrimary} />
          </Pressable>

          <Text style={styles.heading}>
            {vm.isEdit ? APP_STRINGS.RequestScreen.editRequest : APP_STRINGS.RequestScreen.raiseRequest}
          </Text>
        </View>

        <Text style={styles.inputLabels}>{APP_STRINGS.eventScreen.eventName}</Text>
        <AppInput
          placeholder={APP_STRINGS.placeHolders.eventName}
          value={vm.eventName}
          onChangeText={vm.setEventName}
          error={vm.errors.eventName}
        />

        <Text style={styles.inputLabels}>{APP_STRINGS.eventScreen.sportName}</Text>

        {vm.isEdit ? (
          <AppInput
            value={selectedSportName}
            placeholder={APP_STRINGS.placeHolders.sportsName}
            editable={false}
            onChangeText={() => {}}
          />
        ) : (
          <>
            <Pressable onPress={() => setShowSportList((p) => !p)}>
              <View pointerEvents="none">
                <AppInput
                  placeholder={
                    vm.sportsLoading ? APP_STRINGS.placeHolders.loadingSports : APP_STRINGS.placeHolders.selectSports
                  }
                  value={selectedSportName}
                  editable={false}
                  onChangeText={() => {}}
                  error={vm.errors.sportId}
                />
              </View>
            </Pressable>

            {showSportList && (
              <View style={{ marginTop: 8 }}>
                {vm.sports.map((s) => (
                  <Pressable
                    key={s.id}
                    onPress={() => {
                      vm.setSportId(s.id);
                      setShowSportList(false);
                    }}
                    style={[
                      styles.formatOption,
                      vm.sportId === s.id && styles.formatOptionActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.formatOptionText,
                        vm.sportId === s.id && styles.formatOptionTextActive,
                      ]}
                    >
                      {s.name}
                    </Text>
                    {vm.sportId === s.id && (
                      <Check size={14} color={colors.primaryText} />
                    )}
                  </Pressable>
                ))}
              </View>
            )}
          </>
        )}

        <View style={styles.inputContainer}>
  <Text style={styles.inputLabels}>{APP_STRINGS.RequestScreen.gender}</Text>
  <View style={styles.formatOptions}>
    {vm.genderOptions
      .filter((o) => !o.hidden) 
      .map((o) => {
        const g = o.value;
        const isSelected = vm.gender === g;
        return (
          <Pressable
            key={g}
            onPress={() => {
              if (!o.disabled) vm.setGender(g);
            }}
            style={[
              styles.formatOption,
              isSelected && styles.formatOptionActive,
              o.disabled && { opacity: 0.4 }, 
            ]}
            disabled={o.disabled}
          >
            <Text
              style={[
                styles.formatOptionText,
                isSelected && styles.formatOptionTextActive,
              ]}
            >
              {g}
            </Text>
            {isSelected && <Check size={14} color={colors.primaryText} />}
          </Pressable>
        );
      })}
  </View>
</View>

        <View style={styles.inputContainer}>
  <Text style={styles.inputLabels}>{APP_STRINGS.RequestScreen.format}</Text>
  <View style={styles.formatOptions}>
    {vm.formatOptions
      .filter((o) => !o.hidden) 
      .map((o) => {
        const f = o.value;
        const isSelected = vm.format === f;
        return (
          <Pressable
            key={f}
            onPress={() => {
              if (!o.disabled) vm.setFormat(f);
            }}
            style={[
              styles.formatOption,
              isSelected && styles.formatOptionActive,
              o.disabled && { opacity: 0.4 },
            ]}
            disabled={o.disabled}
          >
            <Text
              style={[
                styles.formatOptionText,
                isSelected && styles.formatOptionTextActive,
              ]}
            >
              {f}
            </Text>
            {isSelected && <Check size={14} color={colors.primaryText} />}
          </Pressable>
        );
      })}
  </View>
</View>

  
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabels}>{APP_STRINGS.RequestScreen.startDate}</Text>
            <Pressable
              onPress={() => {
                vm.showStartPicker();
              }}
            >
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
            <Text style={styles.inputLabels}>{APP_STRINGS.RequestScreen.endDate}</Text>
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
          <Text style={styles.inputLabels}>{APP_STRINGS.RequestScreen.venue}</Text>
          <AppInput
            placeholder={APP_STRINGS.placeHolders.venue}
            value={vm.requestedVenue}
            onChangeText={vm.setRequestedVenue}
            error={vm.errors.requestedVenue}
          />
        </View>

       
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabels}>{APP_STRINGS.RequestScreen.logisticRequirements}</Text>
          <AppInput
            placeholder={APP_STRINGS.placeHolders.logisticRequirements}
            value={vm.logisticsRequirements}
            onChangeText={vm.setLogisticsRequirements}
            
          />
        </View>

        <AppButton
          title={vm.isEdit ? APP_STRINGS.RequestScreen.updateRequest : APP_STRINGS.RequestScreen.raiseRequest}
          onPress={vm.onSubmit}
          disabled={vm.submitting}
        />
      </View>
    </ScreenWrapper>
  );
};

export default EventRequestFormScreen;
