import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { fontsSize } from '../../theme/fonts';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  errorText: {
    color: colors.error,
    fontSize: fontsSize.medium,
    marginBottom: 12,
    textAlign: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  heading: {
    color: colors.textPrimary,
    fontSize: fontsSize.extraLarge,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noUsersStyle: {
    color: colors.textSecondary,
    fontSize: fontsSize.medium,
    marginTop: 24,
    textAlign: 'center',
  },
  searchContainer: {
    alignItems: 'center',
    backgroundColor: colors.inputField,
    borderRadius: 10,
    flexDirection: 'row',
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: fontsSize.medium,
    marginLeft: 8,
    padding: 0,
  },
});
