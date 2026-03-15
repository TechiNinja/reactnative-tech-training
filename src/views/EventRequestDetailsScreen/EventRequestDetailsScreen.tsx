import React from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react-native';
import ScreenWrapper from '../../components/ScreenWrapper/ScreenWrapper';
import AppButton from '../../components/AppButton/AppButton';
import { colors } from '../../theme/colors';
import { useEventRequestDetailsViewModel } from '../../viewModels/EventRequestDetailsViewModel';
import { APP_STRINGS } from '../../constants/AppStrings';
import { styles } from './EventRequestDetailsScreenStyle';

const EventRequestDetailsScreen = () => {
  const {
    request,
    canUpdate,
    canCreateEvent,
    handleBack,
    handleUpdate,
    handleCreateEvent,
  } = useEventRequestDetailsViewModel();

  if (!request) {
    return (
      <ScreenWrapper>
        <Text style={styles.errorText}>{APP_STRINGS.RequestScreen.noRequestFound}</Text>
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
                {APP_STRINGS.RequestScreen.endDate}{request.endDate}
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
                {APP_STRINGS.RequestScreen.logistics} {request.logisticsRequirements}
              </Text>
            )}

            {!!request.remarks?.trim() && (
              <Text style={styles.description}>
                {APP_STRINGS.RequestScreen.remarks} {request.remarks}
              </Text>
            )}

            {request.operationsReviewerName != null && (
              <Text style={styles.description}>
                {APP_STRINGS.RequestScreen.operationsReviewerName} {request.operationsReviewerName}
              </Text>
            )}

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

        <View style={styles.footer}>
          <View style={styles.buttonRow}>
            <View style={styles.buttonFlex}>
              <AppButton
                title={APP_STRINGS.RequestScreen.update}
                disabled={!canUpdate}
                onPress={handleUpdate}
              />
            </View>

            <View style={styles.buttonFlex}>
              <AppButton
                title={APP_STRINGS.RequestScreen.createEvent}
                disabled={!canCreateEvent}
                onPress={handleCreateEvent}
              />
            </View>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default EventRequestDetailsScreen;