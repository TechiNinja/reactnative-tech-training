import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { fontsSize } from '../../theme/fonts';

const ACTION_CARD_GAP = 12;
const HORIZONTAL_PADDING = 16;
const SCREEN_WIDTH = Dimensions.get('window').width;
const ACTION_CARD_WIDTH =
  (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - ACTION_CARD_GAP * 2) / 3;

export const styles = StyleSheet.create({
  actionCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCardWrapper: {
    width: ACTION_CARD_WIDTH,
  },
  analyticsGrid: {
    alignItems: 'center',
    marginTop: 25,
  },
  container: {
    paddingHorizontal: 20,
  },
  greeting: {
    color: colors.textPrimary,
    fontSize: fontsSize.extraLarge,
    fontWeight: 'bold',
    paddingTop: 5,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heading: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    paddingLeft: 2,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 5,
  },
  tagline: {
    color: colors.textSecondary,
    fontSize: 18,
    paddingTop: 10,
  },
});
