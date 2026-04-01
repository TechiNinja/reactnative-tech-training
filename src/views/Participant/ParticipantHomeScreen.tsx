import { Text, TouchableOpacity, View } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper/ScreenWrapper';
import { APP_STRINGS } from '../../constants/AppStrings';
import AnalyticsCard from '../../components/AnalyticsCard/AnalyticsCard';
import {
  Calendar,
  LogOut,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { styles } from './ParticipantHomeScreenStyles';
import MyTeamCard from '../../components/MyTeamCard/MyTeamCard';
import { useParticipantHomeViewModel } from '../../viewModels/ParticipantHomeScreenViewModel';

const ParticipantHomeScreen = () => {
  const viewModel = useParticipantHomeViewModel();

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return styles.gameStatusCompleted;
      case 'LIVE':
        return styles.gameStatusLive;
      default:
        return styles.gameStatusUpcoming;
    }
  };

  return (
    <ScreenWrapper scrollable={true}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.greeting}>
            Hello, {viewModel.user?.name?.split(' ')[0] ?? 'Participant'}! 👋
          </Text>

          <TouchableOpacity onPress={viewModel.onLogout}>
            <LogOut size={22} color={colors.error} />
          </TouchableOpacity>
        </View>
        <View style={styles.analyticsGrid}>
          <View style={styles.row}>
            <AnalyticsCard
              icon={<Calendar size={24} color={colors.primary} />}
              title={APP_STRINGS.participantScreens.myEvents}
              data={viewModel.myEventsCount}
            />
            <AnalyticsCard
              icon={<Users size={24} color={colors.usersIconBackground} />}
              title={APP_STRINGS.participantScreens.myTeam}
              data={viewModel.myTeamsCount}
            />
          </View>
          <View style={styles.row}>
            <AnalyticsCard
              icon={<Trophy size={24} color={colors.participantBackgroud} />}
              title={APP_STRINGS.participantScreens.matchesPlayed}
              data={viewModel.matchesPlayedCount}
            />
            <AnalyticsCard
              icon={
                <TrendingUp size={24} color={colors.matchesIconBackgound} />
              }
              title={APP_STRINGS.participantScreens.wins}
              data={viewModel.winsCount}
            />
          </View>
        </View>

        <View>
          <Text style={styles.heading}>
            {APP_STRINGS.participantScreens.myTeam}
          </Text>

          {viewModel.myTeams.length > 0 ? (
            viewModel.myTeams.map((teamData, index) => (
              <MyTeamCard
                key={teamData.id || `team-${index}`}
                logo={
                  <Text style={styles.logoStyle}>
                    {(teamData.name || '').substring(0, 2).toUpperCase()}
                  </Text>
                }
                name={teamData.name}
                members={teamData.members}
                sport={viewModel.resolveCategoryName(teamData.eventCategoryId)}
                wins={0}
                losses={0}
                winRate="0%"
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {APP_STRINGS.eventScreen.noTeamsFound}
              </Text>
            </View>
          )}
        </View>

        <View>
          <Text style={styles.heading}>
            {APP_STRINGS.eventScreen.todaysMatches}
          </Text>

          {viewModel.todaysMatches.length > 0 ? (
            viewModel.todaysMatches.map((matchData) => {
              const isAWinner = matchData.scoreA > matchData.scoreB;
              const isBWinner = matchData.scoreB > matchData.scoreA;

              return (
                <View key={matchData.id} style={styles.matchCard}>
                  <View style={styles.detailContainer}>
                    <Text style={styles.matchSport}>{matchData.sport}</Text>
                    <Text style={getStatusStyle(matchData.status)}>
                      {matchData.status}
                    </Text>
                  </View>
                  <View style={styles.matchTeamsRow}>
                    <View style={styles.teamColumn}>
                      <View style={styles.logoCircle}>
                        <Text style={styles.logoText}>
                          {matchData.teamA.substring(0, 2).toUpperCase()}
                        </Text>
                      </View>
                      <Text style={styles.matchTeamName}>
                        {matchData.teamA}
                      </Text>
                      <Text
                        style={[
                          styles.scoreText,
                          isAWinner && styles.winnerScore,
                        ]}
                      >
                        {matchData.scoreA}
                      </Text>
                    </View>

                    <Text style={styles.vsText}>vs</Text>

                    <View style={styles.teamColumn}>
                      <View style={styles.logoCircle}>
                        <Text style={styles.logoText}>
                          {matchData.teamB.substring(0, 2).toUpperCase()}
                        </Text>
                      </View>
                      <Text style={styles.matchTeamName}>
                        {matchData.teamB}
                      </Text>
                      <Text
                        style={[
                          styles.scoreText,
                          isBWinner && styles.winnerScore,
                        ]}
                      >
                        {matchData.scoreB}
                      </Text>
                    </View>
                  </View>

                  {matchData.status === 'COMPLETED' && (
                    <Text style={styles.winnerText}>
                      Winner: {isAWinner ? matchData.teamA : matchData.teamB}
                    </Text>
                  )}
                </View>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {APP_STRINGS.eventScreen.notMatchesToday}
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ParticipantHomeScreen;
