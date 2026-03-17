import { Text, TouchableOpacity, View } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper/ScreenWrapper';
import { APP_STRINGS } from '../../constants/AppStrings';
import { styles } from './OperationHomeScreenStyle';
import AnalyticsCard from '../../components/AnalyticsCard/AnalyticsCard';
import {
  Bell,
  Calendar,
  ClipboardList,
  Clock,
  LogOut,
  MapPin,
  Settings,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react-native';
import { colors } from '../../theme/colors';
import ActionCard from '../../components/ActionsCard/ActionCard';
import LiveMatchesCard from '../../components/MatchesCard/LiveMatchesCard';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useOperationHomeViewModel } from '../../viewModels/OperationHomeScreenViewModel';
import { MOCK_MATCHES } from '../../constants/mockMatches';
import { ActivityIndicator } from 'react-native';

const OperationHomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    loading,
    analytics,
    notificationCount,
    onLogoutPress,
    onOpenRequests,
    onOpenNotifications,
  } = useOperationHomeViewModel(navigation);

  return (
    <ScreenWrapper scrollable={true}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.greeting}>
            {APP_STRINGS.OperationScreen.operation}
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
                  title={APP_STRINGS.adminScreens.totalRequest}
                  data={analytics.totalRequests}
                />
                <AnalyticsCard
                  icon={<Users size={24} color={colors.usersIconBackground} />}
                  title={APP_STRINGS.adminScreens.pendingRequest}
                  data={analytics.pendingRequests}
                />
              </View>
              <View style={styles.row}>
                <AnalyticsCard
                  icon={
                    <Trophy size={24} color={colors.participantBackgroud} />
                  }
                  title={APP_STRINGS.adminScreens.totalEvents}
                  data={analytics.totalEvents}
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
                icon={
                  <ClipboardList
                    size={20}
                    color={colors.participantBackgroud}
                  />
                }
                title="Requests"
                onPress={onOpenRequests}
              />
            </View>

            <View style={styles.actionCardWrapper}>
              <ActionCard
                icon={
                  <View style={{ position: 'relative' }}>
                    <Bell size={20} color={colors.primary} />
                    {notificationCount > 0 ? (
                      <View
                        style={styles.badgeStyle}
                      >
                        <Text
                          style={styles.badgeCount}
                        >
                          {notificationCount > 99 ? '99+' : notificationCount}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                }
                title={APP_STRINGS.adminScreens.bell}
                onPress={onOpenNotifications}
              />
            </View>
          </View>
        </View>

        <View>
          <Text style={styles.heading}>
            {APP_STRINGS.eventScreen.todaysMatches}
          </Text>

          {MOCK_MATCHES.map((match) => (
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
    </ScreenWrapper>
  );
};

export default OperationHomeScreen;
