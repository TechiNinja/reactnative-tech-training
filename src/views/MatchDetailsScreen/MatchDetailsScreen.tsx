import React from 'react';
import {
  View, Text, Pressable, ScrollView, ActivityIndicator, Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ArrowLeft, Calendar, MapPin, Minus, Plus, CheckCircle, X, Edit2 } from 'lucide-react-native';
import ScreenWrapper from '../../components/ScreenWrapper/ScreenWrapper';
import AppButton from '../../components/AppButton/AppButton';
import { colors } from '../../theme/colors';
import { useMatchDetailsScreenViewModel } from '../../viewModels/MatchDetailsScreenViewModel';
import { styles } from './MatchDetailsScreenStyles';
import { APP_STRINGS } from '../../constants/appStrings';
import { formatDisplayDateTime } from '../../utils/dateUtils';

const SetStatus = {
  COMPLETED: 'Completed',
  LIVE: 'Live',
} as const;

const MatchDetailsScreen = () => {
  const viewModel = useMatchDetailsScreenViewModel();

  if (viewModel.loading) {
    return (
      <ScreenWrapper>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  if (!viewModel.match) {
    return (
      <ScreenWrapper>
        <Text style={styles.errorText}>{APP_STRINGS.matchScreen.matchNotFound}</Text>
      </ScreenWrapper>
    );
  }

  const { match, sets } = viewModel;
  const isLive = viewModel.isMatchLive;
  const isCompleted = viewModel.isMatchCompleted;
  const isUpcoming = viewModel.isMatchUpcoming;

  return (
    <ScreenWrapper scrollable={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={viewModel.handleBack} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>{APP_STRINGS.matchScreen.matchDetails}</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.matchCard}>
            <View style={styles.statusRow}>
              {isLive ? (
                <View style={styles.liveIndicator}>
                  <View style={styles.liveDot} />
                  <Text style={[styles.statusText, styles.statusTextLive]}>
                    {APP_STRINGS.eventScreen.live.toUpperCase()}
                  </Text>
                </View>
              ) : (
                <View
                  style={[
                    styles.statusBadge,
                    isUpcoming && styles.statusUpcoming,
                    isCompleted && styles.statusCompleted,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      isUpcoming && styles.statusTextUpcoming,
                      isCompleted && styles.statusTextCompleted,
                    ]}
                  >
                    {match.status}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.teamsRow}>
              <View style={styles.teamBlock}>
                <View style={styles.teamAvatar}>
                  <Text style={styles.teamAvatarText}>{match.sideAName.substring(0, 2).toUpperCase()}</Text>
                </View>
                <Text style={styles.teamName} numberOfLines={2}>{match.sideAName}</Text>
                <Text style={styles.setScore}>
                  {sets.filter((s) => s.scoreA > s.scoreB).length}
                </Text>
              </View>

              <Text style={styles.vsText}>{APP_STRINGS.matchScreen.vs}</Text>

              <View style={styles.teamBlock}>
                <View style={styles.teamAvatar}>
                  <Text style={styles.teamAvatarText}>{match.sideBName.substring(0, 2).toUpperCase()}</Text>
                </View>
                <Text style={styles.teamName} numberOfLines={2}>{match.sideBName}</Text>
                <Text style={styles.setScore}>
                  {sets.filter((s) => s.scoreB > s.scoreA).length}
                </Text>
              </View>
            </View>

            {match.matchDateTime && (
              <View style={styles.infoRow}>
                <Calendar size={15} color={colors.textSecondary} />
                <Text style={styles.infoText}>{formatDisplayDateTime(match.matchDateTime)}</Text>
              </View>
            )}

            {match.matchVenue ? (
              <View style={styles.infoRow}>
                <MapPin size={15} color={colors.textSecondary} />
                <Text style={styles.infoText}>{match.matchVenue}</Text>
              </View>
            ) : null}

            {match.totalSets > 0 && (
              <Text style={styles.setsLabel}>{APP_STRINGS.matchScreen.bestOf(match.totalSets)}</Text>
            )}
          </View>

          {sets.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{APP_STRINGS.matchScreen.sets}</Text>
              {sets.map((s) => {
                const isEditing = viewModel.editingSetId === s.id;
                const isSetCompleted = s.status === SetStatus.COMPLETED;
                const isSetLive = s.status === SetStatus.LIVE;
                return (
                  <View key={s.id}>
                    <View style={styles.setRow}>
                      <Text style={styles.setNumber}>{APP_STRINGS.matchScreen.setLabel(s.setNumber)}</Text>
                      <View style={styles.setScores}>
                        <Text style={[styles.setScoreA, s.scoreA > s.scoreB && styles.winScore]}>{s.scoreA}</Text>
                        <Text style={styles.setDash}>—</Text>
                        <Text style={[styles.setScoreB, s.scoreB > s.scoreA && styles.winScore]}>{s.scoreB}</Text>
                      </View>
                      <View style={[
                        styles.setStatusBadge,
                        isSetCompleted && styles.setStatusCompleted,
                        isSetLive && styles.setStatusLive,
                      ]}>
                        <Text style={styles.setStatusText}>{s.status}</Text>
                      </View>
                      {viewModel.canEditScore && isSetCompleted && !isEditing && (
                        <Pressable onPress={() => viewModel.handleEditCompletedSet(s)} style={styles.editSetBtn}>
                          <Edit2 size={14} color={colors.primary} />
                        </Pressable>
                      )}
                    </View>
                    {isEditing && viewModel.canEditScore && (
                      <View style={styles.inlineEditContainer}>
                        <Text style={styles.inlineEditTitle}>{APP_STRINGS.matchScreen.editSetLabel(s.setNumber)}</Text>
                        <View style={styles.scoreInputRow}>
                          <View style={styles.scoreInputBlock}>
                            <Text style={styles.scoreTeamName} numberOfLines={1}>{match.sideAName}</Text>
                            <View style={styles.scoreControls}>
                              <Pressable style={styles.scoreBtn} onPress={() => viewModel.decrementScore('A')}>
                                <Minus size={18} color={colors.textPrimary} />
                              </Pressable>
                              <Text style={styles.scoreValue}>{viewModel.tempScoreA}</Text>
                              <Pressable style={styles.scoreBtn} onPress={() => viewModel.incrementScore('A')}>
                                <Plus size={18} color={colors.textPrimary} />
                              </Pressable>
                            </View>
                          </View>
                          <View style={styles.scoreInputBlock}>
                            <Text style={styles.scoreTeamName} numberOfLines={1}>{match.sideBName}</Text>
                            <View style={styles.scoreControls}>
                              <Pressable style={styles.scoreBtn} onPress={() => viewModel.decrementScore('B')}>
                                <Minus size={18} color={colors.textPrimary} />
                              </Pressable>
                              <Text style={styles.scoreValue}>{viewModel.tempScoreB}</Text>
                              <Pressable style={styles.scoreBtn} onPress={() => viewModel.incrementScore('B')}>
                                <Plus size={18} color={colors.textPrimary} />
                              </Pressable>
                            </View>
                          </View>
                        </View>
                        <View style={styles.scoreActions}>
                          <Pressable style={styles.saveScoreBtn} onPress={() => viewModel.handleSaveScore(true)} disabled={viewModel.saving}>
                            <Text style={styles.saveScoreBtnText}>{APP_STRINGS.matchScreen.saveEdit}</Text>
                          </Pressable>
                          <Pressable style={styles.saveScoreBtn} onPress={viewModel.handleCancelEditSet}>
                            <Text style={styles.saveScoreBtnText}>{APP_STRINGS.buttons.cancel}</Text>
                          </Pressable>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}

          {isCompleted && match.result && (
            <View style={styles.winnerBanner}>
              <CheckCircle size={18} color={colors.participantBackgroud} />
              <Text style={styles.winnerText}>
                {APP_STRINGS.matchScreen.winner(
                  match.result.winnerId === match.sideAId ? match.sideAName : match.sideBName,
                )}
              </Text>
            </View>
          )}

          {viewModel.isOrganizer && isUpcoming && (
            <AppButton
              title={APP_STRINGS.matchScreen.reschedule}
              onPress={() => viewModel.setShowScheduleModal(true)}
            />
          )}

          {viewModel.canEditScore && viewModel.currentSetNumber !== null && viewModel.editingSetId === null && (
            <View style={styles.scoreSection}>
              <Text style={styles.sectionTitle}>{APP_STRINGS.matchScreen.setScoreLabel(viewModel.currentSetNumber)}</Text>
              <View style={styles.scoreInputRow}>
                <View style={styles.scoreInputBlock}>
                  <Text style={styles.scoreTeamName} numberOfLines={1}>{match.sideAName}</Text>
                  <View style={styles.scoreControls}>
                    <Pressable style={styles.scoreBtn} onPress={() => viewModel.decrementScore('A')}>
                      <Minus size={20} color={colors.textPrimary} />
                    </Pressable>
                    <Text style={styles.scoreValue}>{viewModel.tempScoreA}</Text>
                    <Pressable style={styles.scoreBtn} onPress={() => viewModel.incrementScore('A')}>
                      <Plus size={20} color={colors.textPrimary} />
                    </Pressable>
                  </View>
                </View>
                <View style={styles.scoreInputBlock}>
                  <Text style={styles.scoreTeamName} numberOfLines={1}>{match.sideBName}</Text>
                  <View style={styles.scoreControls}>
                    <Pressable style={styles.scoreBtn} onPress={() => viewModel.decrementScore('B')}>
                      <Minus size={20} color={colors.textPrimary} />
                    </Pressable>
                    <Text style={styles.scoreValue}>{viewModel.tempScoreB}</Text>
                    <Pressable style={styles.scoreBtn} onPress={() => viewModel.incrementScore('B')}>
                      <Plus size={20} color={colors.textPrimary} />
                    </Pressable>
                  </View>
                </View>
              </View>
              <View style={styles.scoreActions}>
                <Pressable
                  style={styles.saveScoreBtn}
                  onPress={() => viewModel.handleSaveScore(false)}
                  disabled={viewModel.saving}
                >
                  <Text style={styles.saveScoreBtnText}>
                    {viewModel.saving ? APP_STRINGS.matchScreen.saving : APP_STRINGS.matchScreen.saveScore}
                  </Text>
                </Pressable>
                {viewModel.canCompleteSet ? (
                  <Pressable
                    style={styles.completeSetBtn}
                    onPress={() => viewModel.handleSaveScore(true)}
                    disabled={viewModel.saving}
                  >
                    <CheckCircle size={16} color={colors.primaryText} />
                    <Text style={styles.completeSetBtnText}>{APP_STRINGS.matchScreen.completeSet}</Text>
                  </Pressable>
                ) : (
                  <Text style={styles.tieWarning}>{APP_STRINGS.matchScreen.tieWarning}</Text>
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      <Modal
        visible={viewModel.showScheduleModal}
        transparent
        animationType="slide"
        onRequestClose={() => viewModel.setShowScheduleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{APP_STRINGS.matchScreen.reschedule}</Text>
              <Pressable onPress={() => viewModel.setShowScheduleModal(false)}>
                <X size={22} color={colors.textPrimary} />
              </Pressable>
            </View>

            <Text style={styles.modalLabel}>{APP_STRINGS.matchScreen.date}</Text>
            <Pressable style={styles.datePickerBtn} onPress={() => viewModel.setShowDatePicker(true)}>
              <Calendar size={16} color={colors.primary} />
              <Text style={styles.datePickerText}>{formatDisplayDateTime(viewModel.selectedDate)}</Text>
            </Pressable>

            {viewModel.showDatePicker && (
              <DateTimePicker
                value={viewModel.selectedDate}
                mode="date"
                display="default"
                minimumDate={new Date(viewModel.eventStartDate)}
                maximumDate={new Date(viewModel.eventEndDate)}
                onChange={(_, date) => {
                  viewModel.setShowDatePicker(false);
                  if (date) {
                    const updated = new Date(viewModel.selectedDate);
                    updated.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                    viewModel.setSelectedDate(updated);
                  }
                }}
              />
            )}

            <Text style={styles.modalLabel}>{APP_STRINGS.matchScreen.time}</Text>
            <Pressable style={styles.datePickerBtn} onPress={() => viewModel.setShowTimePicker(true)}>
              <Calendar size={16} color={colors.primary} />
              <Text style={styles.datePickerText}>{formatDisplayDateTime(viewModel.selectedDate)}</Text>
            </Pressable>

            {viewModel.showTimePicker && (
              <DateTimePicker
                value={viewModel.selectedDate}
                mode="time"
                display="default"
                onChange={(_, date) => {
                  viewModel.setShowTimePicker(false);
                  if (date) {
                    const updated = new Date(viewModel.selectedDate);
                    updated.setHours(date.getHours(), date.getMinutes());
                    viewModel.setSelectedDate(updated);
                  }
                }}
              />
            )}

            {viewModel.scheduleError ? (
              <Text style={styles.errorText}>{viewModel.scheduleError}</Text>
            ) : null}

            <AppButton
              title={viewModel.saving ? APP_STRINGS.matchScreen.saving : APP_STRINGS.matchScreen.confirmSchedule}
              onPress={viewModel.handleSaveSchedule}
              disabled={viewModel.saving}
            />
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

export default MatchDetailsScreen;