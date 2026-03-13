import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { fontsSize } from '../../theme/fonts';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerRight: {
    width: 32,
  },
  backButton: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  centered: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 40,
  },
  errorText: {
    color: colors.error,
    fontSize: fontsSize.medium,
    marginBottom: 16,
    textAlign: 'center',
  },
  statusRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  roundLabel: {
    color: colors.textSecondary,
    fontSize: fontsSize.medium,
    fontWeight: '500',
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusLive: {
    backgroundColor: colors.participantBackgroud + '20',
  },
  statusUpcoming: {
    backgroundColor: colors.usersIconBackground + '20',
  },
  statusCompleted: {
    backgroundColor: colors.textSecondary + '20',
  },
  statusText: {
    fontSize: fontsSize.small,
    fontWeight: '700',
  },
  statusTextLive: {
    color: colors.participantBackgroud,
  },
  statusTextUpcoming: {
    color: colors.usersIconBackground,
  },
  statusTextCompleted: {
    color: colors.textSecondary,
  },
  liveDot: {
    backgroundColor: colors.participantBackgroud,
    borderRadius: 5,
    height: 8,
    marginRight: 6,
    width: 8,
  },
  liveBadgeRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  scoreboardCard: {
    backgroundColor: colors.cardBackgroud,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
    padding: 20,
  },
  scoreboardRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  teamBlock: {
    alignItems: 'center',
    flex: 1,
  },
  teamAvatar: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    marginBottom: 8,
    width: 48,
  },
  teamAvatarTBD: {
    backgroundColor: colors.border,
  },
  teamName: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    minHeight: 36,
    textAlign: 'center',
  },
  teamNameTBD: {
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  setsWon: {
    color: colors.textPrimary,
    fontSize: 40,
    fontWeight: '800',
    marginTop: 4,
  },
  setsWonWinner: {
    color: colors.participantBackgroud,
  },
  vsBlock: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  vsText: {
    color: colors.textSecondary,
    fontSize: fontsSize.primary,
    fontWeight: '700',
  },
  winnerBanner: {
    alignItems: 'center',
    backgroundColor: colors.participantBackgroud + '15',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginTop: 14,
    paddingVertical: 10,
  },
  winnerText: {
    color: colors.participantBackgroud,
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: colors.cardBackgroud,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    marginBottom: 20,
    padding: 14,
  },
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  infoText: {
    color: colors.textPrimary,
    fontSize: fontsSize.medium,
  },
  infoMuted: {
    color: colors.textSecondary,
    fontSize: fontsSize.small,
    marginTop: 2,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  setRow: {
    alignItems: 'center',
    backgroundColor: colors.cardBackgroud,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 14,
  },
  setRowActive: {
    borderColor: colors.primary,
  },
  setRowCompleted: {
    opacity: 0.7,
  },
  setRowLocked: {
    opacity: 0.45,
  },
  setLabel: {
    color: colors.textSecondary,
    fontSize: fontsSize.medium,
    fontWeight: '500',
    width: 55,
  },
  setScores: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  setScore: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    minWidth: 28,
    textAlign: 'center',
  },
  setScoreWinner: {
    color: colors.participantBackgroud,
  },
  setDash: {
    color: colors.textSecondary,
    fontSize: 18,
    fontWeight: '400',
  },
  setStatus: {
    alignItems: 'flex-end',
    width: 70,
  },
  setStatusBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  setStatusLive: {
    backgroundColor: colors.participantBackgroud + '20',
  },
  setStatusCompleted: {
    backgroundColor: colors.textSecondary + '20',
  },
  setStatusNotStarted: {
    backgroundColor: colors.usersIconBackground + '20',
  },
  setStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  setStatusTextLive: {
    color: colors.participantBackgroud,
  },
  setStatusTextCompleted: {
    color: colors.textSecondary,
  },
  setStatusTextNotStarted: {
    color: colors.usersIconBackground,
  },
  editIcon: {
    marginLeft: 8,
  },
  actionRow: {
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: colors.primaryText,
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: colors.border,
    borderRadius: 10,
    paddingVertical: 14,
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.45,
  },
  modalOverlay: {
    backgroundColor: colors.appBackground + '20',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.cardBackgroud,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  modalLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 6,
    marginTop: 16,
  },
  dateTimeButton: {
    alignItems: 'center',
    backgroundColor: colors.inputField,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dateTimeButtonText: {
    color: colors.textPrimary,
    fontSize: fontsSize.medium,
  },
  setsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    marginTop: 4,
  },
  setsCountBtn: {
    alignItems: 'center',
    backgroundColor: colors.border,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  setsCount: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    minWidth: 40,
    textAlign: 'center',
  },
  scheduleButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    marginTop: 24,
    paddingVertical: 14,
  },
  scheduleButtonText: {
    color: colors.primaryText,
    fontSize: 15,
    fontWeight: '600',
  },
  setEditorScoreRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  setEditorTeamBlock: {
    alignItems: 'center',
    flex: 1,
  },
  setEditorTeamName: {
    color: colors.textPrimary,
    fontSize: fontsSize.medium,
    fontWeight: '500',
    marginBottom: 12,
    textAlign: 'center',
  },
  setEditorControls: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  setEditorBtn: {
    alignItems: 'center',
    backgroundColor: colors.border,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  setEditorScore: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: '700',
    minWidth: 50,
    textAlign: 'center',
  },
  setEditorActions: {
    gap: 10,
  },
  tieWarning: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
});