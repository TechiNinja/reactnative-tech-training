import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { fontsSize } from '../../theme/fonts';

export const styles = StyleSheet.create({
  backButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
    padding: 4,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  headingContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginTop: 30,
  },
  headingText: {
    color: colors.textPrimary,
    fontSize: fontsSize.extraLarge,
    fontWeight: 'bold',
  },
  inputLabel: {
    color: colors.textPrimary,
    fontSize: 18,
    marginTop: 25,
  },
  subText: {
    color: colors.textSecondary,
    fontSize: fontsSize.regular,
    marginTop: 4,
  },
  trophyContainer: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 10,
  },
});
