import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  activeTab: {
    backgroundColor: colors.appBackground,
  },
  activeTabText: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  container: {
    backgroundColor: colors.inputField,
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: 12,
    paddingHorizontal: 5,
    padding: 4,
  },
  tab: {
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    paddingVertical: 10,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
});
