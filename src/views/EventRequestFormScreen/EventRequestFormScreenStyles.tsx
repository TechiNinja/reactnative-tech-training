import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { fonts, fontsSize } from '../../theme/fonts';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  dateTime: {
    marginTop: 10,
  },

  errorText: {
    color: colors.error,
    fontSize: fontsSize.primary,
    marginTop: 4,
  },

  formatOption: {
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

  formatOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  formatOptionDisabled: {
    opacity: 0.4,
  },

  formatOptionText: {
    color: colors.textPrimary,
    fontSize: fontsSize.medium,
    fontWeight: '500',
  },

  formatOptionTextActive: {
    color: colors.primaryText,
  },

  formatOptions: {
    flexDirection: 'row',
    gap: 12,
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

  input: {
    backgroundColor: colors.appBackground,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.textPrimary,
    fontSize: fontsSize.medium,
    height: 48,
    paddingHorizontal: 12,
  },

  inputContainer: {
    flex: 2,
  },

  inputLabels: {
    color: colors.textPrimary,
    fontFamily: fonts.subHeading,
    fontSize: 18,
    marginBottom: 10,
    marginTop: 15,
  },

  inputRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'space-evenly',
  },

  primaryBtn: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    marginTop: 20,
    padding: 16,
  },

  primaryText: {
    color: colors.textPrimary,
    fontSize: fontsSize.regular,
    fontWeight: '600',
  },
});
