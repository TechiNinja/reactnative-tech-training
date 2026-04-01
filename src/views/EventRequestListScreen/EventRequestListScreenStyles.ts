import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { fontsSize } from '../../theme/fonts';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },

  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  heading: {
    color: colors.textPrimary,
    fontSize: fontsSize.extraLarge,
    fontWeight: 'bold',
  },

  headingParticipant: {
    color: colors.textPrimary,
    fontSize: fontsSize.extraLarge,
    fontWeight: 'bold',
    marginVertical: 20,
  },

  noEventStyle: {
    color: colors.textPrimary,
    fontSize: fontsSize.extraLarge,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  button: {
    borderWidth: 0.5,
    borderRadius: 30,
    borderColor: colors.primary,
    marginVertical: 20,
    padding: 10,
  },
  notificationIconContainer: {
    width: 28,
    height: 28,
  },

  badgeContainer: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },

  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
  },

  listContentContainer: {
    flexGrow: 1,
  },
});
