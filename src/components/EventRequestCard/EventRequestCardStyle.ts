import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { fontsSize } from '../../theme/fonts';

export const styles = StyleSheet.create({
  actionText: {
    fontWeight: 'bold',
  },

  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },

  adminActionContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  container: {
    backgroundColor: colors.cardBackgroud,
    borderRadius: 16,
    elevation: 2,
    marginBottom: 12,
    padding: 16,
  },

  details: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    marginTop: 10,
  },

  detailsText: {
    color: colors.textSecondary,
  },

  iconBtn: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  iconContainer: {
    alignItems: 'center',
    marginTop: 30,
  },

  info: {
    justifyContent: 'center',
    marginTop: 10,
  },

  left: {
    flex: 1,
  },

  organizerActionContainer: {
    alignItems: 'center',
    flex: 1,
  },

  participantActionContainer: {
    alignItems: 'center',
    flex: 1,
  },

  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  primaryBtnText: {
    color: colors.appBackground,
    fontSize: fontsSize.medium,
    fontWeight: 'bold',
  },

  progressBar: {
    backgroundColor: colors.inputField,
    borderRadius: 4,
    height: 6,
    overflow: 'hidden',
    width: 90,
  },

  progressFill: {
    backgroundColor: colors.primary,
    height: '100%',
  },

  sportText: {
    color: colors.textSecondary,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  status: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  statusText: {
    fontSize: fontsSize.small,
    fontWeight: 'bold',
  },

  status_CANCELLED: {
    backgroundColor: colors.error + '20',
    borderRadius: 20,
    color: colors.error,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  status_COMPLETED: {
    backgroundColor: colors.error + '20',
    borderRadius: 20,
    color: colors.error,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  status_LIVE: {
    backgroundColor: colors.participantBackgroud + '20',
    borderRadius: 20,
    color: colors.participantBackgroud,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  status_OPEN: {
    backgroundColor: colors.matchesIconBackgound + '20',
    borderRadius: 20,
    color: colors.matchesIconBackgound,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  status_UPCOMING: {
    backgroundColor: colors.usersIconBackground + '20',
    borderRadius: 20,
    color: colors.usersIconBackground,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  subText: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },

  teamDetails: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    minWidth: 90,
  },

  teamRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginTop: 12,
  },

  teamText: {
    color: colors.textPrimary,
    fontSize: fontsSize.medium,
  },

  title: {
    color: colors.textPrimary,
    fontSize: fontsSize.regular,
    fontWeight: 'bold',
    marginTop: 10,
  },
});
