import React from 'react';
import {
  Text,
  View,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
} from 'react-native';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react-native';

import ScreenWrapper from '../../components/ScreenWrapper/ScreenWrapper';
import AppButton from '../../components/AppButton/AppButton';

import { colors } from '../../theme/colors';
import { useEventRequestDetailsViewModel } from '../../viewModels/EventRequestDetailsViewModel';
import { APP_STRINGS } from '../../constants/appStrings';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { RequestStatus } from '../../models/EventRequest';
import { styles } from './EventRequestDetailsScreenStyle';

type Props = NativeStackScreenProps<RootStackParamList, 'EventRequestDetails'>;

const EventRequestDetailsScreen = ({ route }: Props) => {
  const { role } = route.params;

  const {
    request,
    canApprove,
    canReject,
    canUpdate,
    canCreateEvent,
    canWithdraw,
    approvingOrRejecting,
    remarks,
    remarksModalVisible,
    isSubmitDisabled,
    handleBack,
    handleApproved,
    handleRejected,
    handleCreateEvent,
    handleWithdraw,
    handleUpdate,
    formatDate,
    setRemarks,
    openRemarksModal,
    closeRemarksModal,
    submitDecision,
  } = useEventRequestDetailsViewModel();

  if (!request) {
    return (
      <ScreenWrapper>
        <Text style={styles.errorText}>
          {APP_STRINGS.RequestScreen.noRequestFound}
        </Text>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scrollable={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.textPrimary} />
          </Pressable>

          <Text style={styles.headerTitle}>{request.eventName}</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.infoCard}>
            <View style={styles.statusRow}>
              <Text style={styles.sportBadge}>{request.sportsName}</Text>
              <Text style={styles.statusBadge}>{request.status}</Text>
            </View>

            <View style={styles.infoRow}>
              <Calendar size={18} color={colors.textSecondary} />
              <Text style={styles.infoText}>
                {APP_STRINGS.RequestScreen.startDate} {request.startDate}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Calendar size={18} color={colors.textSecondary} />
              <Text style={styles.infoText}>
                {APP_STRINGS.RequestScreen.endDate} {request.endDate}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <MapPin size={18} color={colors.textSecondary} />
              <Text style={styles.infoText}>{request.requestedVenue}</Text>
            </View>

            <Text style={styles.description}>
              {APP_STRINGS.RequestScreen.gender} {request.gender}
            </Text>

            <Text style={styles.description}>
              {APP_STRINGS.RequestScreen.format} {request.format}
            </Text>

            {!!request.logisticsRequirements?.trim() && (
              <Text style={styles.description}>
                {APP_STRINGS.RequestScreen.logistics}{' '}
                {request.logisticsRequirements}
              </Text>
            )}

            {!!request.remarks?.trim() && (
              <Text style={styles.description}>
                {APP_STRINGS.RequestScreen.remarks} {request.remarks}
              </Text>
            )}

            <Text style={styles.description}>
              {APP_STRINGS.RequestScreen.operationsReviewerName}{' '}
              {request.operationsReviewerName}
            </Text>

            <Text style={styles.description}>
              {APP_STRINGS.RequestScreen.create}{' '}
              {formatDate(request.createdDate)}
            </Text>

            {request.updatedDate && (
              <Text style={styles.description}>
                {APP_STRINGS.RequestScreen.update}
                {formatDate(request.updatedDate)}
              </Text>
            )}
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>

        {role === 'admin' && (
          <View style={styles.footer}>
            <View style={styles.buttonRow}>
              {request.status === RequestStatus.PENDING && (
                <>
                  <View style={styles.buttonFlex}>
                    <AppButton
                      title={APP_STRINGS.RequestScreen.updateRequired}
                      disabled={!canUpdate}
                      onPress={handleUpdate}
                    />
                  </View>

                  <View style={styles.buttonFlex}>
                    <AppButton
                      title={APP_STRINGS.RequestScreen.withdraw}
                      disabled={!canWithdraw}
                      onPress={handleWithdraw}
                    />
                  </View>
                </>
              )}

              {request.status === RequestStatus.APPROVED && (
                <View style={styles.buttonFlex}>
                  <AppButton
                    title={APP_STRINGS.RequestScreen.createEvent}
                    disabled={!canCreateEvent}
                    onPress={handleCreateEvent}
                  />
                </View>
              )}
            </View>
          </View>
        )}

        {role === 'operations' && request.status === RequestStatus.PENDING && (
          <View style={styles.footer}>
            <View style={styles.buttonRow}>
              <View style={styles.buttonFlex}>
                <AppButton
                  title={APP_STRINGS.RequestScreen.approve}
                  disabled={!canApprove}
                  onPress={handleApproved}
                />
              </View>

              <View style={styles.buttonFlex}>
                <AppButton
                  title={APP_STRINGS.RequestScreen.reject}
                  disabled={!canReject}
                  onPress={handleRejected}
                />
              </View>
            </View>
          </View>
        )}

        <Modal
          visible={remarksModalVisible}
          transparent
          animationType="fade"
          onRequestClose={closeRemarksModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                {APP_STRINGS.RequestScreen.enterRemarks}
              </Text>

              <TextInput
                value={remarks}
                onChangeText={setRemarks}
                placeholder={APP_STRINGS.RequestScreen.writeRemarks}
                placeholderTextColor={colors.textSecondary}
                multiline
                editable={!approvingOrRejecting}
                style={styles.remarksInput}
              />

              <View style={styles.modalButtonRow}>
                <View style={styles.buttonFlex}>
                  <AppButton
                    title={APP_STRINGS.RequestScreen.cancel}
                    onPress={closeRemarksModal}
                    disabled={approvingOrRejecting}
                  />
                </View>

                <View style={styles.buttonFlex}>
                  <AppButton
                    title={APP_STRINGS.RequestScreen.submit}
                    onPress={submitDecision}
                    disabled={isSubmitDisabled}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScreenWrapper>
  );
};

export default EventRequestDetailsScreen;