import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { fonts, fontsSize } from '../../theme/fonts';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  errorText: {
    color: colors.error,
    fontSize: fontsSize.primary,
    marginTop: 4,
  },
  headerRow: {
    alignItems: 'center',
    marginBottom: 10,
  },
  heading: {
    color: colors.textPrimary,
    fontSize: fontsSize.large,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  iconContainer: {
    left: 0,
    position: 'absolute',
    top: 3,
  },
  inputContainer: {
    marginBottom: 4,
  },
  inputLabels: {
    color: colors.textPrimary,
    fontFamily: fonts.subHeading,
    fontSize: 18,
    marginBottom: 10,
    marginTop: 15,
  },
  roleOption: {
    alignItems: 'center',
    backgroundColor: colors.cardBackgroud,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  roleOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roleOptionText: {
    color: colors.textPrimary,
    fontSize: fontsSize.medium,
    fontWeight: '500',
  },
  roleOptionTextActive: {
    color: colors.primaryText,
  },
  roleOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  toggle: {
    backgroundColor: colors.inputField,
    borderRadius: 20,
    height: 32,
    padding: 4,
    width: 56,
  },
  toggleActive: {
    backgroundColor: colors.participantBackgroud,
  },
  toggleLabel: {
    color: colors.textPrimary,
    fontSize: fontsSize.medium,
    fontWeight: '500',
  },
  toggleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingVertical: 12,
  },
  toggleSubtext: {
    color: colors.textSecondary,
    fontSize: fontsSize.primary,
    marginTop: 4,
  },
  toggleThumb: {
    backgroundColor: colors.textPrimary,
    borderRadius: 14,
    height: 24,
    width: 24,
  },
  toggleThumbActive: {
    transform: [{ translateX: 24 }],
  },
});
