import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { fontsSize } from '../../theme/fonts';

const ACTION_CARD_GAP = 12;
const HORIZONTAL_PADDING = 16;
const SCREEN_WIDTH = Dimensions.get('window').width;
const ACTION_CARD_WIDTH =
  (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - ACTION_CARD_GAP * 2) / 2;

export const styles = StyleSheet.create({
  actionCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  actionCardWrapper: {
    width: ACTION_CARD_WIDTH,
  },
  analyticsGrid: {
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 25,
  },
  circleLogo: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 21,
    height: 42,
    justifyContent: 'center',
    marginBottom: 4,
    width: 42,
  },
  container: {
    paddingHorizontal: 20,
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: colors.cardBackgroud,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 10,
    padding: 24,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: fontsSize.medium,
  },
  gameStatusCompleted: {
    backgroundColor: colors.error + '20',
    borderColor: colors.error,
    borderRadius: 14,
    borderWidth: 1,
    color: colors.error,
    fontSize: fontsSize.small,
    fontWeight: 'bold',
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  gameStatusLive: {
    backgroundColor: colors.participantBackgroud + '20',
    borderColor: colors.participantBackgroud,
    borderRadius: 14,
    borderWidth: 1,
    color: colors.participantBackgroud,
    fontWeight: 'bold',
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  gameStatusUpcoming: {
    backgroundColor: colors.usersIconBackground + '20',
    borderColor: colors.usersIconBackground,
    borderRadius: 14,
    borderWidth: 1,
    color: colors.usersIconBackground,
    fontWeight: 'bold',
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  greeting: {
    color: colors.textPrimary,
    fontSize: fontsSize.extraLarge,
    fontWeight: 'bold',
    marginLeft: 10,
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
    marginHorizontal: 10,
    marginVertical: 20,
    paddingLeft: 2,
  },
  logoCircle: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    marginBottom: 4,
    width: 40,
  },
  logoStyle: {
    color: colors.appBackground,
    fontSize: fontsSize.large,
    fontWeight: 'bold',
  },
  logoText: {
    color: colors.appBackground,
    fontWeight: 'bold',
  },
  matchCard: {
    backgroundColor: colors.cardBackgroud,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    marginHorizontal: 10,
    padding: 16,
  },
  matchInfo: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  matchInfoText: {
    color: colors.textSecondary,
    fontSize: fontsSize.primary,
    marginLeft: 4,
  },
  matchSport: {
    color: colors.textSecondary,
    fontSize: fontsSize.primary,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  matchTeamName: {
    color: colors.textPrimary,
    fontSize: fontsSize.regular,
    fontWeight: '600',
  },
  matchTeams: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  matchTeamsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 5,
  },
  scoreBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
  },
  scoreText: {
    color: colors.textSecondary,
    fontSize: 18,
    marginTop: 4,
  },
  tagline: {
    color: colors.textSecondary,
    fontSize: 18,
    marginLeft: 10,
    paddingTop: 10,
  },
  teamBlock: {
    alignItems: 'center',
    width: '35%',
  },
  teamColumn: {
    alignItems: 'center',
    flex: 1,
  },
  vsText: {
    color: colors.textSecondary,
    fontSize: fontsSize.regular,
    marginHorizontal: 12,
  },
  winnerScore: {
    color: colors.participantBackgroud,
    fontSize: 20,
    fontWeight: 'bold',
  },
  winnerText: {
    color: colors.participantBackgroud,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
});
