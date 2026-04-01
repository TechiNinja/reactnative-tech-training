import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { fontsSize } from '../../theme/fonts';

export const styles = StyleSheet.create({
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  container: {
    backgroundColor: colors.cardBackgroud,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  eventName: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    marginTop: 6,
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  liveDot: {
    backgroundColor: colors.participantBackgroud,
    borderRadius: 4,
    height: 7,
    marginRight: 4,
    width: 7,
  },
  matchContent: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  roundName: {
    color: colors.textPrimary,
    fontSize: fontsSize.medium,
    fontWeight: '600',
  },
  scheduleBtn: {
    alignItems: 'center',
    borderColor: colors.primary,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  scheduleBtnText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  score: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
  },
  statusBadge: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
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
  viewBtn: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  viewBtnText: {
    color: colors.primaryText,
    fontSize: 12,
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
  deleteBtn: {
    alignItems: 'center',
    borderColor: colors.error,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  deleteBtnText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: '500',
  },
  winnerScore: {
    color: colors.participantBackgroud,
  },
  winnerText: {
    color: colors.participantBackgroud,
    fontSize: 13,
    fontWeight: '600',
  },
  headerLeft: {
    flex: 1,
  },
  liveWatchContainer: {
    marginTop: 8,
    alignItems: 'flex-end',
  },
  liveWatchText: {
    color: colors.participantBackgroud,
    fontSize: 12,
    fontWeight: '600',
  },
  participantViewBtn: {
    alignItems: 'center',
    borderColor: colors.primary,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  participantViewBtnText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
});