import React, { useState } from 'react';
import { Text, View, ScrollView, Pressable, Modal, TextInput } from 'react-native';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react-native';
import ScreenWrapper from '../../components/ScreenWrapper/ScreenWrapper';
import AppButton from '../../components/AppButton/AppButton';
import { colors } from '../../theme/colors';
import { styles } from '../EventDetailsScreen/EventDetailsScreenStyles';
import { useEventRequestDetailsViewModel } from '../../viewModels/EventRequestDetailsViewModel';
import { APP_STRINGS } from '../../constants/AppStrings';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { RequestStatus } from '../../models/EventRequest';

type Props = NativeStackScreenProps<RootStackParamList, 'EventRequestDetails'>;

const EventRequestDetailsScreen = ({ route }: Props) => {
  const { role } = route.params;

  const {
    request,
    canApproved,
    canRejected,
    handleBack,
    handleApproved,
    handleRejected,
    handleCreateEvent,
    handleWithdraw,
    handleUpdate,
    canUpdate,
    canCreateEvent,
    approvingOrRejecting,
    canWithdraw
  
  } = useEventRequestDetailsViewModel();

  const [remarksModalVisible, setRemarksModalVisible] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [decision, setDecision] = useState<'Approved' | 'Rejected' | null>(null);

  const openRemarksModal = (type: 'Approved' | 'Rejected') => {
    setDecision(type);
    setRemarks('');
    setRemarksModalVisible(true);
  };

  const closeRemarksModal = () => {
    if (approvingOrRejecting) return; 
    setRemarksModalVisible(false);
    setDecision(null);
    setRemarks('');
  };

  const submitDecision = () => {
    const text = remarks.trim();
    if (!text || !decision) return;

    if (decision === 'Approved') {
      handleApproved(text);
    } else {
      handleRejected(text);
    }
  };

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
                {APP_STRINGS.RequestScreen.endDate}
                {request.endDate}
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
              {APP_STRINGS.RequestScreen.created} {request.createdDate}
            </Text>

            {request.updatedDate && (
              <Text style={styles.description}>
                {APP_STRINGS.RequestScreen.update} {request.updatedDate}
              </Text>
            )}
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>

      {(role === 'admin' && ( 
        <View style={styles.footer}>
          <View style={styles.buttonRow}>

        {request.status === RequestStatus.PENDING && ( 
          <>
            <View style={styles.buttonFlex}>
              <AppButton
                title={APP_STRINGS.RequestScreen.update}
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
      ))}

        {(role === 'operations' && request.status === RequestStatus.PENDING) && (
          <View style={styles.footer}>
            <View style={styles.buttonRow}>
              <View style={styles.buttonFlex}>
                <AppButton
                  title="Approved"
                  disabled={!canApproved}
                  onPress={() => openRemarksModal('Approved')}
                />
              </View>

              <View style={styles.buttonFlex}>
                <AppButton
                  title="Rejected"
                  disabled={!canRejected}
                  onPress={() => openRemarksModal('Rejected')}
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
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              padding: 16,
            }}
          >
            <View
              style={{
                backgroundColor: colors.cardBackgroud,
                borderRadius: 12,
                padding: 16,
              }}
            >
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: 16,
                  fontWeight: '600',
                }}
              >
                Enter Remarks
              </Text>

              <TextInput
                value={remarks}
                onChangeText={setRemarks}
                placeholder="Write remarks..."
                placeholderTextColor={colors.textSecondary}
                multiline
                editable={!approvingOrRejecting}
                style={{
                  marginTop: 12,
                  minHeight: 90,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 10,
                  padding: 12,
                  color: colors.textPrimary,
                  textAlignVertical: 'top',
                }}
              />

              <View style={{ flexDirection: 'row', gap: 12, marginTop: 14 }}>
                <View style={{ flex: 1 }}>
                  <AppButton
                    title="Cancel"
                    onPress={closeRemarksModal}
                    disabled={approvingOrRejecting}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <AppButton
                    title="Submit"
                    onPress={submitDecision}
                    disabled={!remarks.trim() || approvingOrRejecting}
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