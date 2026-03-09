import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { fontsSize } from '../../theme/fonts';

export const styles = StyleSheet.create({
  arrowContainer: {
    justifyContent: 'center',
    paddingLeft: 8,
  },
  container: {
    backgroundColor: colors.cardBackgroud,
    borderRadius: 16,
    elevation: 2,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 16,
  },
  content: {
    flex: 1,
  },
  email: {
    color: colors.textSecondary,
    fontSize: fontsSize.medium,
    marginTop: 4,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    color: colors.textPrimary,
    fontSize: fontsSize.regular,
    fontWeight: 'bold',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  roleBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  roleText: {
    fontSize: fontsSize.small,
    fontWeight: 'bold',
  },
  roleText_admin: {
    color: colors.primary,
  },
  roleText_operations: {
    color: colors.matchesIconBackgound,
  },
  roleText_organizer: {
    color: colors.usersIconBackground,
  },
  roleText_participant: {
    color: colors.participantBackgroud,
  },
  role_admin: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
    borderWidth: 1,
  },
  role_operations: {
    backgroundColor: colors.matchesIconBackgound + '20',
    borderColor: colors.matchesIconBackgound,
    borderWidth: 1,
  },
  role_organizer: {
    backgroundColor: colors.usersIconBackground + '20',
    borderColor: colors.usersIconBackground,
    borderWidth: 1,
  },
  role_participant: {
    backgroundColor: colors.participantBackgroud + '20',
    borderColor: colors.participantBackgroud,
    borderWidth: 1,
  },
  statusDot: {
    borderRadius: 3,
    height: 6,
    width: 6,
  },
  statusDotActive: {
    backgroundColor: colors.participantBackgroud,
  },
  statusDotInactive: {
    backgroundColor: colors.error,
  },
  statusRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  statusText: {
    color: colors.textSecondary,
    fontSize: fontsSize.small,
  },
});
