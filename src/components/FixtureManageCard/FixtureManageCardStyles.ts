import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { fontsSize } from '../../theme/fonts';

export const styles = StyleSheet.create({
  completeButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 14,
  },
  completeButtonText: {
    color: colors.primaryText,
    fontSize: 15,
    fontWeight: '600',
  },
  container: {
    backgroundColor: colors.cardBackgroud,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  controlButton: {
    alignItems: 'center',
    backgroundColor: colors.border,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  controlButtonPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  controlButtonText: {
    color: colors.textPrimary,
    fontSize: fontsSize.medium,
    fontWeight: '500',
  },
  controlButtonTextPrimary: {
    color: colors.primaryText,
    fontSize: fontsSize.medium,
    fontWeight: '600',
  },
  controlsContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    marginTop: 16,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  matchContent: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalActions: {
    gap: 12,
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
  modalOverlay: {
    backgroundColor: colors.appBackground + '20',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  modalVs: {
    color: colors.textSecondary,
    fontSize: fontsSize.medium,
    fontWeight: '600',
    marginHorizontal: 8,
  },
  roundName: {
    color: colors.textPrimary,
    fontSize: fontsSize.medium,
    fontWeight: '600',
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: colors.border,
    borderRadius: 10,
    paddingVertical: 14,
  },
  saveButtonText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  score: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
  },
  scoreButton: {
    alignItems: 'center',
    backgroundColor: colors.border,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  scoreControls: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  scoreInputContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  scoreInputSection: {
    alignItems: 'center',
    flex: 1,
  },
  scoreTeamName: {
    color: colors.textPrimary,
    fontSize: fontsSize.medium,
    fontWeight: '500',
    marginBottom: 12,
    textAlign: 'center',
  },
  scoreValue: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: '700',
    minWidth: 50,
    textAlign: 'center',
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusCompleted: {
    backgroundColor: colors.textSecondary + '20',
  },
  statusLive: {
    backgroundColor: colors.participantBackgroud + '20',
  },
  statusText: {
    fontSize: fontsSize.small,
    fontWeight: '600',
  },
  statusTextCompleted: {
    color: colors.textSecondary,
  },
  statusTextLive: {
    color: colors.participantBackgroud,
  },
  statusTextUpcoming: {
    color: colors.usersIconBackground,
  },
  statusUpcoming: {
    backgroundColor: colors.usersIconBackground + '20',
  },
  tbdIcon: {
    backgroundColor: colors.border,
  },
  tbdText: {
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  teamIcon: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    marginBottom: 8,
    width: 40,
  },
  teamName: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
    minHeight: 32,
    textAlign: 'center',
  },
  teamSection: {
    alignItems: 'center',
    flex: 1,
  },
  tieWarning: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  vsContainer: {
    paddingHorizontal: 12,
  },
  vsText: {
    color: colors.textSecondary,
    fontSize: fontsSize.primary,
    fontWeight: '600',
  },
  winnerBanner: {
    alignItems: 'center',
    backgroundColor: colors.participantBackgroud + '15',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 8,
  },
  winnerScore: {
    color: colors.participantBackgroud,
  },
  winnerText: {
    color: colors.participantBackgroud,
    fontSize: 13,
    fontWeight: '600',
  },
});
