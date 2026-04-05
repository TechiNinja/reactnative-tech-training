import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.inputField,
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 4,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 2, 
  },
  activeTab: {
    backgroundColor: colors.appBackground,
    paddingVertical: 8,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: 11,       
    fontWeight: '500',
    lineHeight: 16,
    textAlign: 'center',
  },
  activeTabText: {
    color: colors.textPrimary,
    fontWeight: '700',
    lineHeight: 16,
  },
});