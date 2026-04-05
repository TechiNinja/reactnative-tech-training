import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { fontsSize } from '../../theme/fonts';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  heading: {
    color: colors.textPrimary,
    fontSize: fontsSize.extraLarge,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logo: {
    color: colors.appBackground,
    fontSize: fontsSize.extraLarge,
  },
  logoContainer: {
    backgroundColor: colors.primary,
    borderRadius: 40,
    padding: 10,
  },
  noTeamStyle: {
    color: colors.textPrimary,
    fontSize: fontsSize.extraLarge,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
});
