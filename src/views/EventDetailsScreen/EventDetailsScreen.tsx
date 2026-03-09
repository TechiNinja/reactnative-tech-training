import React from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Trophy,
  Trash2,
} from 'lucide-react-native';
import ScreenWrapper from '../../components/ScreenWrapper/ScreenWrapper';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import AppButton from '../../components/AppButton/AppButton';
import { colors } from '../../theme/colors';
import { styles } from './EventDetailsScreenStyles';
import { APP_STRINGS } from '../../constants/AppStrings';
import { useEventDetailsViewModel } from '../../viewModels/EventDetailsScreenViewModel';

const EventDetailsScreen = () => {
  const {
    event,
    role,
    categories,
    canEditOrDelete,
    canRegister,
    getRegisterButtonText,
    handleCategoryPress,
    handleEditEvent,
    handleDeleteEvent,
    handleBack,
    handleRegister,
  } = useEventDetailsViewModel();

  if (!event) {
    return (
      <ScreenWrapper>
        <Text style={styles.errorText}>
          {APP_STRINGS.eventScreen.noEventFound}
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
          <Text style={styles.headerTitle}>{event.name}</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.infoCard}>
            <View style={styles.statusRow}>
              <Text style={styles.sportBadge}>{event.sport}</Text>
              <Text
                style={[styles.statusBadge, styles[`status_${event.status}`]]}
              >
                {event.status}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Calendar size={18} color={colors.textSecondary} />
              <Text style={styles.infoText}>
                {event.date} • {event.time}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <MapPin size={18} color={colors.textSecondary} />
              <Text style={styles.infoText}>{event.venue}</Text>
            </View>

            <View style={styles.infoRow}>
              <Trophy size={18} color={colors.textSecondary} />
              <Text style={styles.infoText}>
                Formats: {event.format === '2v2' ? 'Doubles' : 'Singles'}
              </Text>
            </View>

            {event.description && (
              <Text style={styles.description}>{event.description}</Text>
            )}
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

          {event.prizes.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {APP_STRINGS.eventScreen.prizes}
              </Text>
              <View style={styles.prizeList}>
                {event.prizes.map((prize, index) => (
                  <View key={index} style={styles.prizeItem}>
                    <Text style={styles.prizeEmoji}>
                      {index === 0 ? '🏆' : index === 1 ? '🥈' : '🥉'}
                    </Text>
                    <View>
                      <Text style={styles.prizePosition}>
                        {index === 0 ? '1st' : index === 1 ? '2nd' : '3rd'}
                        Place
                      </Text>
                      <Text style={styles.prizeValue}>{prize}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

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
            <View style={styles.buttonRow}>
              <View style={styles.buttonFlex}>
                <AppButton
                  title={APP_STRINGS.eventScreen.edit}
                  onPress={handleEditEvent}
                />
              </View>
              <Pressable
                style={styles.deleteButton}
                onPress={handleDeleteEvent}
              >
                <Trash2 size={24} color={colors.error} />
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default EventDetailsScreen;
