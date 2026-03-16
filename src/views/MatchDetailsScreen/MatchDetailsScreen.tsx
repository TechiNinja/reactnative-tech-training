import React from 'react';
import {
  View, Text, Pressable, ScrollView, ActivityIndicator, Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ArrowLeft, Calendar, MapPin, Minus, Plus, CheckCircle, X, Play, Edit2 } from 'lucide-react-native';
import ScreenWrapper from '../../components/ScreenWrapper/ScreenWrapper';
import AppButton from '../../components/AppButton/AppButton';
import { colors } from '../../theme/colors';
import { useMatchDetailsViewModel } from '../../viewModels/MatchDetailsScreenViewModel';
import { styles } from './MatchDetailsScreenStyles';

const MatchDetailsScreen = () => {
  const viewModel = useMatchDetailsViewModel();

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
        <Text style={styles.errorText}>Match not found</Text>
      </ScreenWrapper>
    );
  }

  const { match, sets } = viewModel;
  const isLive      = viewModel.isMatchLive;
  const isCompleted = viewModel.isMatchCompleted;
  const isUpcoming  = viewModel.isMatchUpcoming;
  const isScheduled = isUpcoming && !!match.matchDateTime && match.totalSets > 0;

  return (
    <ScreenWrapper scrollable={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => viewModel.navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Match Details</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.matchCard}>
            <View style={styles.statusRow}>
              <View style={[styles.statusBadge, isLive && styles.statusLive, isUpcoming && styles.statusUpcoming, isCompleted && styles.statusCompleted]}>
                <Text style={[styles.statusText, isLive && styles.statusTextLive, isUpcoming && styles.statusTextUpcoming, isCompleted && styles.statusTextCompleted]}>
                  {match.status}
                </Text>
              </View>
              {isLive && (
                <View style={styles.liveIndicator}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
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

              <Text style={styles.vsText}>vs</Text>

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
                <Text style={styles.infoText}>{viewModel.formatDateTimeFromUTC(match.matchDateTime)}</Text>
              </View>
            )}

            {match.matchVenue ? (
              <View style={styles.infoRow}>
                <MapPin size={15} color={colors.textSecondary} />
                <Text style={styles.infoText}>{match.matchVenue}</Text>
              </View>
            ) : null}

            {match.totalSets > 0 && (
              <Text style={styles.setsLabel}>Best of {match.totalSets} sets</Text>
            )}
          </View>

          {sets.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sets</Text>
              {sets.map((s) => {
                const isEditing      = viewModel.editingSetId === s.id;
                const isSetCompleted = s.status === 'Completed';
                const isSetLive      = s.status === 'Live';
                return (
                  <View key={s.id}>
                    <View style={styles.setRow}>
                      <Text style={styles.setNumber}>Set {s.setNumber}</Text>
                      <View style={styles.setScores}>
                        <Text style={[styles.setScoreA, s.scoreA > s.scoreB && styles.winScore]}>{s.scoreA}</Text>
                        <Text style={styles.setDash}>—</Text>
                        <Text style={[styles.setScoreB, s.scoreB > s.scoreA && styles.winScore]}>{s.scoreB}</Text>
                      </View>
                      <View style={[styles.setStatusBadge, isSetCompleted && styles.setStatusCompleted, isSetLive && styles.setStatusLive]}>
                        <Text style={styles.setStatusText}>{s.status}</Text>
                      </View>
                      {viewModel.canEditScore && isSetCompleted && !isEditing && (
                        <Pressable onPress={() => viewModel.handleEditCompletedSet(s)} style={{ marginLeft: 8 }}>
                          <Edit2 size={14} color={colors.primary} />
                        </Pressable>
                      )}
                    </View>
                    {isEditing && viewModel.canEditScore && (
                      <View style={styles.inlineEditContainer}>
                        <Text style={styles.inlineEditTitle}>Edit Set {s.setNumber}</Text>
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
                            <Text style={styles.saveScoreBtnText}>Save Edit</Text>
                          </Pressable>
                          <Pressable style={[styles.saveScoreBtn, { marginTop: 8 }]} onPress={viewModel.handleCancelEditSet}>
                            <Text style={styles.saveScoreBtnText}>Cancel</Text>
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
                Winner: {match.result.winnerId === match.sideAId ? match.sideAName : match.sideBName}
              </Text>
            </View>
          )}

          {viewModel.isOrganizer && isUpcoming && (
            <AppButton
              title={match.matchDateTime ? 'Reschedule' : 'Schedule Match'}
              onPress={() => viewModel.setShowScheduleModal(true)}
            />
          )}

          {viewModel.isOrganizer && isScheduled && (
            <Pressable
              style={styles.startMatchBtn}
              onPress={viewModel.handleStartMatch}
              disabled={viewModel.saving}
            >
              <Play size={16} color={colors.primaryText} />
              <Text style={styles.startMatchBtnText}>
                {viewModel.saving ? 'Starting...' : 'Start Match (Go Live)'}
              </Text>
            </Pressable>
          )}

          {viewModel.canEditScore && viewModel.currentSetNumber !== null && viewModel.editingSetId === null && (
            <View style={styles.scoreSection}>
              <Text style={styles.sectionTitle}>Set {viewModel.currentSetNumber} Score</Text>
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
                <Pressable style={styles.saveScoreBtn} onPress={() => viewModel.handleSaveScore(false)} disabled={viewModel.saving}>
                  <Text style={styles.saveScoreBtnText}>Save Score</Text>
                </Pressable>
                {viewModel.canCompleteSet ? (
                  <Pressable style={styles.completeSetBtn} onPress={() => viewModel.handleSaveScore(true)} disabled={viewModel.saving}>
                    <CheckCircle size={16} color={colors.primaryText} />
                    <Text style={styles.completeSetBtnText}>Complete Set</Text>
                  </Pressable>
                ) : (
                  <Text style={styles.tieWarning}>Scores must differ to complete set</Text>
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      <Modal visible={viewModel.showScheduleModal} transparent animationType="slide" onRequestClose={() => viewModel.setShowScheduleModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Schedule Match</Text>
              <Pressable onPress={() => viewModel.setShowScheduleModal(false)}>
                <X size={22} color={colors.textPrimary} />
              </Pressable>
            </View>

            <Text style={styles.modalLabel}>Date</Text>
            <Pressable style={styles.datePickerBtn} onPress={() => viewModel.setShowDatePicker(true)}>
              <Calendar size={16} color={colors.primary} />
              <Text style={styles.datePickerText}>{viewModel.formatDateTime(viewModel.selectedDate) ?? ''}</Text>
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

            <Text style={styles.modalLabel}>Time</Text>
            <Pressable style={styles.datePickerBtn} onPress={() => viewModel.setShowTimePicker(true)}>
              <Calendar size={16} color={colors.primary} />
              <Text style={styles.datePickerText}>
                {viewModel.formatDateTime(viewModel.selectedDate) ?? ''}
              </Text>
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

            <Text style={styles.modalLabel}>Total Sets (1–10)</Text>
            <View style={styles.setsInputRow}>
              <Pressable style={styles.scoreBtn} onPress={() => viewModel.setTotalSets((p) => Math.max(1, p - 1))}>
                <Minus size={18} color={colors.textPrimary} />
              </Pressable>
              <Text style={styles.setsValue}>{viewModel.totalSets}</Text>
              <Pressable style={styles.scoreBtn} onPress={() => viewModel.setTotalSets((p) => Math.min(10, p + 1))}>
                <Plus size={18} color={colors.textPrimary} />
              </Pressable>
            </View>

            {viewModel.scheduleError ? (
              <Text style={styles.errorText}>{viewModel.scheduleError}</Text>
            ) : null}

            <AppButton
              title={viewModel.saving ? 'Saving...' : 'Confirm Schedule'}
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