import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { fontsSize } from '../../theme/fonts';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: colors.cardBackgroud,
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: fontsSize.veryLarge,
    fontWeight: '700',
    marginBottom: 16,
    color: colors.textPrimary,
  },
  label: {
    fontSize: fontsSize.regular,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: fontsSize.medium,
    backgroundColor: colors.inputField,
    color: colors.textPrimary,
  },
  tabContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  tab: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: colors.inputField,
  },
  selectedTab: {
    borderColor: colors.border,
    backgroundColor: colors.primary,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: fontsSize.medium,
    fontWeight: '500',
  },
  selectedTabText: {
    color: colors.primaryText,
    fontWeight: '700',
  },
  errorText: {
    color: colors.error,
    fontSize: fontsSize.primary,
    marginTop: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cancelButton: {
    backgroundColor: colors.error,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  cancelButtonText: {
    fontSize: fontsSize.regular,
    fontWeight: '600',
    color: colors.primaryText,
  },
  createButton: {
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  createButtonText: {
    color: colors.primaryText,
    fontSize: fontsSize.regular,
    fontWeight: '700',
  },
});
