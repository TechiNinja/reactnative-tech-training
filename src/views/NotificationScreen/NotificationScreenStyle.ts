import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { fontsSize } from '../../theme/fonts';

export const styles = StyleSheet.create({
  backButton: {
    padding: 4,
  },

  container: {
    flex: 1,
  },


  header: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerRight: {
    width: 32,
  },
  headerTitle: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
 

  


});
