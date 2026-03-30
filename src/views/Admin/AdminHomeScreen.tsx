import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper/ScreenWrapper';
import { APP_STRINGS } from '../../constants/appStrings';
import { styles } from './AdminHomeScreenStyles';
import AnalyticsCard from '../../components/AnalyticsCard/AnalyticsCard';
import {
  Bell,
  Calendar,
  Clock,
  LogOut,
  MapPin,
  Plus,
  TrendingUp,
  Trophy,
  UserPlus,
  Users,
} from 'lucide-react-native';
import { colors } from '../../theme/colors';
import ActionCard from '../../components/ActionsCard/ActionCard';
import LiveMatchesCard from '../../components/MatchesCard/LiveMatchesCard';
import { MOCK_MATCHES } from '../../constants/mockMatches';
import { useAdminHomeViewModel } from '../../viewModels/AdminHomeScreenViewModel';
import { useNotificationBadge } from '../../utils/useNotificationBadge';
import {SportModal} from '../../components/SportModal/SportModal';

const AdminHomeScreen = () => {
  const {
    onLogoutPress,
    onRaiseRequest,
    onAddUser,
    analytics,
    loading,
    onGetNotification,
    isSportModalVisible,
    onOpenSportModal,
    onCloseSportModal,
  } = useAdminHomeViewModel();

  const { count } = useNotificationBadge('Admin');

  return (
    <ScreenWrapper scrollable={true}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.greeting}>
            {APP_STRINGS.adminScreens.greeting}
          </Text>

          <TouchableOpacity onPress={onLogoutPress}>
            <LogOut size={22} color={colors.error} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          analytics && (
            <View style={styles.analyticsGrid}>
              <View style={styles.row}>
                <AnalyticsCard
                  icon={<Calendar size={24} color={colors.primary} />}
                  title={APP_STRINGS.adminScreens.totalEvents}
                  data={analytics.totalEvents}
                />
                <AnalyticsCard
                  icon={<Users size={24} color={colors.usersIconBackground} />}
                  title={APP_STRINGS.adminScreens.activeUsers}
                  data={analytics.activeUsers}
                />
              </View>

              <View style={styles.row}>
                <AnalyticsCard
                  icon={
                    <Trophy size={24} color={colors.participantBackgroud} />
                  }
                  title={APP_STRINGS.adminScreens.team}
                  data={analytics.teams}
                />
                <AnalyticsCard
                  icon={
                    <TrendingUp size={24} color={colors.matchesIconBackgound} />
                  }
                  title={APP_STRINGS.adminScreens.matchesToday}
                  data={analytics.matchesToday}
                />
              </View>
            </View>
          )
        )}

        <View>
          <Text style={styles.heading}>
            {APP_STRINGS.adminScreens.quickActions}
          </Text>

          <View style={styles.actionCardContainer}>
            <View style={styles.actionCardWrapper}>
              <ActionCard
                icon={<Plus size={20} color={colors.participantBackgroud} />}
                title={APP_STRINGS.adminScreens.raiseEventRequest}
                onPress={onRaiseRequest}
              />
            </View>

            <View style={styles.actionCardWrapper}>
              <ActionCard
                icon={<UserPlus size={20} color={colors.usersIconBackground} />}
                title={APP_STRINGS.adminScreens.addUser}
                onPress={onAddUser}
              />
            </View>

            <View style={styles.actionCardWrapper}>
              <ActionCard
                icon={<Plus size={20} color={colors.primary} />}
                title={APP_STRINGS.app.addSports}
                onPress={onOpenSportModal}
              />
            </View>

            <View style={styles.actionCardWrapper}>
              <ActionCard
                icon={
                  <View style={styles.countHeader}>
                    <Bell size={20} color={colors.primary} />
                    {count > 0 ? (
                      <View style={styles.iconStyle}>
                        <Text style={styles.countStyle}>
                          {count > 99 ? '99+' : count}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                }
                title={APP_STRINGS.adminScreens.bell}
                onPress={onGetNotification}
              />
            </View>
          </View>
        </View>

        <View>
          <Text style={styles.heading}>
            {APP_STRINGS.eventScreen.todaysMatches}
          </Text>

          {MOCK_MATCHES.map(match => (
            <LiveMatchesCard
              key={match.id}
              gameName={match.gameName}
              firstTeam={match.firstTeam}
              secondTeam={match.secondTeam}
              status={match.status}
              firstTeamPoints={match.firstTeamPoints}
              secondTeamPoints={match.secondTeamPoints}
              venue={match.venue}
              venueIcon={<MapPin color={colors.textSecondary} />}
              statusIcon={<Clock color={colors.textSecondary} />}
              firstTeamLogo={
                <View>
                  <Text>
                    {match.firstTeam[0]}
                    {match.firstTeam[1]?.toUpperCase()}
                  </Text>
                </View>
              }
              secondTeamLogo={
                <View>
                  <Text>
                    {match.secondTeam[0]}
                    {match.secondTeam[1]?.toUpperCase()}
                  </Text>
                </View>
              }
            />
          ))}
        </View>
      </View>

      <SportModal visible={isSportModalVisible} onClose={onCloseSportModal} />
    </ScreenWrapper>
  );
};

export default AdminHomeScreen;