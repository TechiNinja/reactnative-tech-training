import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { fontsSize } from '../../theme/fonts';

export const styles = StyleSheet.create({
  activeFormatTab: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  activeFormatText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  buttonContainer: {
    marginBottom: 20,
    marginTop: 32,
  },
  checkIcon: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  container: {
    flex: 1,
    padding: 16,
    paddingHorizontal: 20,
  },
  formatContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  formatOptionCard: {
    alignItems: 'center',
    backgroundColor: colors.cardBackgroud,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  formatOptionCardActive: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary,
  },
  formatOptionCardDisabled: {
    backgroundColor: colors.cardBackgroud,
    borderColor: colors.border,
    opacity: 0.6,
  },
  formatOptionContent: {
    flex: 1,
  },
  formatOptionDesc: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  formatOptionDescDisabled: {
    color: colors.disabled,
  },
  formatOptionTitle: {
    color: colors.textPrimary,
    fontSize: fontsSize.regular,
    fontWeight: '600',
    marginBottom: 4,
  },
  formatOptionTitleDisabled: {
    color: colors.disabled,
  },
  formatSelectionContainer: {
    gap: 12,
  },
  formatTab: {
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  formatText: {
    color: colors.textPrimary,
  },
  formatTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  fullBadge: {
    backgroundColor: colors.error,
    borderRadius: 4,
    color: colors.textPrimary,
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 70,
    marginBottom: 24,
  },
  heading: {
    color: colors.textPrimary,
    fontSize: fontsSize.large,
    fontWeight: 'bold',
  },
  label: {
    color: colors.textPrimary,
    fontSize: fontsSize.regular,
    marginBottom: 6,
    marginTop: 20,
  },
  slotsText: {
    color: colors.textSecondary,
    fontSize: fontsSize.primary,
    marginTop: 4,
  },
  slotsTextFull: {
    color: colors.error,
  },
  subLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 12,
  },
});

 