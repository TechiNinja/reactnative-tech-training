import React from 'react';
import {
  Text,
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Trophy,
  UserCheck,
  X,
  Check,
  Edit,
} from 'lucide-react-native';
import ScreenWrapper from '../../components/ScreenWrapper/ScreenWrapper';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import AppButton from '../../components/AppButton/AppButton';
import { colors } from '../../theme/colors';
import { styles } from './EventDetailsScreenStyles';
import { APP_STRINGS } from '../../constants/AppStrings';
import { useEventDetailsViewModel } from '../../viewModels/EventDetailsScreenViewModel';
import { useAssignOrganizerViewModel } from '../../viewModels/AssignOrganizerViewModel';

const statusStyleMap: Record<string, object> = {
  LIVE:      styles.status_LIVE,
  OPEN:      styles.status_OPEN,
  UPCOMING:  styles.status_UPCOMING,
  COMPLETED: styles.status_COMPLETED,
  CANCELLED: styles.status_CANCELLED,
};

const EventDetailsScreen = () => {
  const {
    event,
    loading,
    error,
    role,
    categories,
    canEditOrDelete,
    canAssignOrganizer,
    canRegister,
    showAssignOrganizer,
    getRegisterButtonText,
    handleCategoryPress,
    handleEditEvent,
    handleBack,
    handleRegister,
    handleOpenAssignOrganizer,
    handleCloseAssignOrganizer,
    handleAssignOrganizerSuccess,
  } = useEventDetailsViewModel();

  const {
    organizers,
    selectedOrganizerId,
    setSelectedOrganizerId,
    loading: loadingOrganizers,
    saving,
    handleAssign,
  } = useAssignOrganizerViewModel(
    event?.id ?? 0,
    event?.organizerName,
    handleAssignOrganizerSuccess,
  );

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  if (error || !event) {
    return (
      <ScreenWrapper>
        <Text style={styles.errorText}>
          {error ?? APP_STRINGS.eventScreen.noEventFound}
        </Text>
      </ScreenWrapper>
    );
  }

  const statusStyle = statusStyleMap[event.status.toUpperCase()] ?? {};

  return (
    <ScreenWrapper scrollable={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>{event.name}</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.infoCard}>
            <View style={styles.statusRow}>
              <Text style={styles.sportBadge}>{event.sportName}</Text>
              <Text style={[styles.statusBadge, statusStyle]}>
                {event.status}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Calendar size={18} color={colors.textSecondary} />
              <Text style={styles.infoText}>
                {String(event.startDate)} — {String(event.endDate)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <MapPin size={18} color={colors.textSecondary} />
              <Text style={styles.infoText}>{event.eventVenue}</Text>
            </View>

            <View style={styles.infoRow}>
              <Trophy size={18} color={colors.textSecondary} />
              <Text style={styles.infoText}>
                Formats:{' '}
                {[...new Set(event.categories?.map((c) => c.format) ?? [])].join(', ')}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Calendar size={18} color={colors.textSecondary} />
              <Text style={styles.infoText}>
                {APP_STRINGS.eventScreen.registrationDeadline}: {String(event.registrationDeadline)}
              </Text>
            </View>

            {event.organizerName ? (
              <View style={styles.infoRow}>
                <UserCheck size={18} color={colors.textSecondary} />
                <Text style={styles.infoText}>
                  {APP_STRINGS.eventScreen.organizer}: {event.organizerName}
                </Text>
              </View>
            ) : null}

            {event.description ? (
              <Text style={styles.description}>{event.description}</Text>
            ) : null}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {APP_STRINGS.eventScreen.categories}
            </Text>
            {categories.length > 0 ? (
              categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  title={category.title}
                  format={category.format}
                  gender={category.gender}
                  participantCount={category.participantCount}
                  totalParticipants={category.totalParticipants}
                  teamCount={category.teamCount}
                  isAbandoned={category.isAbandoned}
                  onPress={() => handleCategoryPress(category)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  {APP_STRINGS.eventScreen.noRegisteredParticipants}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>

        <View style={styles.footer}>
          {role === 'participant' && (
            <AppButton
              title={getRegisterButtonText()}
              disabled={!canRegister}
              onPress={handleRegister}
            />
          )}
          {canEditOrDelete && (
            <View style={styles.adminActionRow}>
              <Pressable style={styles.adminActionBtn} onPress={handleEditEvent}>
                <Edit size={20} color={colors.primary} />
                <Text style={styles.adminActionText}>
                  {APP_STRINGS.eventScreen.editAction}
                </Text>
              </Pressable>
              {canAssignOrganizer && (
                <Pressable style={styles.adminActionBtn} onPress={handleOpenAssignOrganizer}>
                  <UserCheck size={20} color={colors.primary} />
                  <Text style={styles.adminActionText}>
                    {APP_STRINGS.eventScreen.organizerAction}
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </View>

        <Modal
          visible={showAssignOrganizer}
          transparent
          animationType="slide"
          onRequestClose={handleCloseAssignOrganizer}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {APP_STRINGS.eventScreen.assignOrganizer}
                </Text>
                <Pressable onPress={handleCloseAssignOrganizer}>
                  <X size={22} color={colors.textPrimary} />
                </Pressable>
              </View>

              {event.organizerName ? (
                <Text style={styles.currentOrganizer}>
                  {APP_STRINGS.eventScreen.currentOrganizer}: {event.organizerName}
                </Text>
              ) : null}

              {loadingOrganizers ? (
                <ActivityIndicator color={colors.primary} style={styles.modalLoader} />
              ) : organizers.length === 0 ? (
                <Text style={styles.emptyText}>
                  {APP_STRINGS.eventScreen.noOrganizersAvailable}
                </Text>
              ) : (
                <ScrollView style={styles.organizerList}>
                  {organizers.map((org) => {
                    const isSelected = selectedOrganizerId === org.id;
                    return (
                      <Pressable
                        key={org.id}
                        style={[styles.organizerItem, isSelected && styles.organizerItemSelected]}
                        onPress={() => setSelectedOrganizerId(org.id)}
                      >
                        <View style={styles.organizerInfo}>
                          <Text style={styles.organizerName}>{org.fullName}</Text>
                          <Text style={styles.organizerEmail}>{org.email}</Text>
                        </View>
                        {isSelected && <Check size={20} color={colors.primary} />}
                      </Pressable>
                    );
                  })}
                </ScrollView>
              )}

              <AppButton
                title={saving ? APP_STRINGS.eventScreen.assigning : APP_STRINGS.eventScreen.assignOrganizer}
                disabled={saving || !selectedOrganizerId}
                onPress={handleAssign}
              />
            </View>
          </View>
        </Modal>
      </View>
    </ScreenWrapper>
  );
};

export default EventDetailsScreen;