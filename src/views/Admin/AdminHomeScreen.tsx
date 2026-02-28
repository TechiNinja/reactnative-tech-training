import { Text, TouchableOpacity, View } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper/ScreenWrapper';
import { APP_STRINGS } from '../../constants/AppStrings';
import { styles } from './AdminHomeScreenStyles';
import AnalyticsCard from '../../components/AnalyticsCard/AnalyticsCard';
import {
  Calendar,
  Clock,
  LogOut,
  MapPin,
  Plus,
  Settings,
  TrendingUp,
  Trophy,
  UserPlus,
  Users,
} from 'lucide-react-native';
import { colors } from '../../theme/colors';
import ActionCard from '../../components/ActionsCard/ActionCard';
import LiveMatchesCard from '../../components/MatchesCard/LiveMatchesCard';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

import { useAdminHomeViewModel } from '../../viewModels/AdminHomeScreenViewModel';
import { MOCK_MATCHES } from '../../constants/mockMatches';

const AdminHomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { onLogoutPress, onAddEvent ,onRaiseRequest } = useAdminHomeViewModel(navigation);

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

        <View style={styles.analyticsGrid}>
          <View style={styles.row}>
            <AnalyticsCard
              icon={<Calendar size={24} color={colors.primary} />}
              title={APP_STRINGS.adminScreens.totalEvents}
              data={24}
            />
            <AnalyticsCard
              icon={<Users size={24} color={colors.usersIconBackground} />}
              title={APP_STRINGS.adminScreens.activeUsers}
              data={156}
            />
          </View>
          <View style={styles.row}>
            <AnalyticsCard
              icon={<Trophy size={24} color={colors.participantBackgroud} />}
              title={APP_STRINGS.adminScreens.team}
              data={48}
            />
            <AnalyticsCard
              icon={
                <TrendingUp size={24} color={colors.matchesIconBackgound} />
              }
              title={APP_STRINGS.adminScreens.matchesToday}
              data={8}
            />
          </View>
        </View>

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
              />
            </View>

            <View style={styles.actionCardWrapper}>
              <ActionCard
                icon={<Settings size={20} color={colors.primary} />}
                title={APP_STRINGS.adminScreens.settings}
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
                    {match.firstTeam[1].toUpperCase()}
                  </Text>
                </View>
              }
              secondTeamLogo={
                <View>
                  <Text>
                    {match.secondTeam[0]}
                    {match.secondTeam[1].toUpperCase()}
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

export default AdminHomeScreen;
