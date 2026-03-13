import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { fontsSize } from '../../theme/fonts';

export const styles = StyleSheet.create({
  backButton: {
    padding: 4,
  },
  bottomPadding: {
    height: 100,
  },
  buttonFlex: {
    flex: 1,
  },
  buttonRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  container: {
    flex: 1,
  },
  deleteButton: {
    alignItems: 'center',
    backgroundColor: colors.error + '15',
    borderColor: colors.error,
    borderRadius: 12,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontsSize.medium,
    lineHeight: 20,
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: colors.cardBackgroud,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    padding: 24,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: fontsSize.medium,
  },
  errorText: {
    color: colors.error,
    fontSize: fontsSize.regular,
    marginTop: 40,
    textAlign: 'center',
  },
  footer: {
    backgroundColor: colors.appBackground,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    bottom: 0,
    left: 0,
    padding: 16,
    position: 'absolute',
    right: 0,
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
  headerRight: {
    width: 32,
  },
  headerTitle: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: colors.cardBackgroud,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    margin: 16,
    padding: 16,
  },
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: fontsSize.medium,
    marginLeft: 10,
  },
  prizeEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  prizeItem: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 8,
  },
  prizeList: {
    backgroundColor: colors.cardBackgroud,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  prizePosition: {
    color: colors.textPrimary,
    fontSize: fontsSize.medium,
    fontWeight: '600',
  },
  prizeValue: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  section: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  sportBadge: {
    backgroundColor: colors.primary + '20',
    borderRadius: 12,
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusBadge: {
    borderRadius: 12,
    fontSize: 13,
    fontWeight: '600',
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  status_CANCELLED: {
    backgroundColor: colors.error + '20',
    color: colors.error,
  },
  status_COMPLETED: {
    backgroundColor: colors.error + '20',
    color: colors.error,
  },
  status_LIVE: {
    backgroundColor: colors.participantBackgroud + '20',
    color: colors.participantBackgroud,
  },
  status_OPEN: {
    backgroundColor: colors.matchesIconBackgound + '20',
    color: colors.matchesIconBackgound,
  },
  status_UPCOMING: {
    backgroundColor: colors.usersIconBackground + '20',
    color: colors.usersIconBackground,
  },
});
