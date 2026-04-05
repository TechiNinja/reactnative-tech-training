import { FlatList, Text, View } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper/ScreenWrapper';
import { styles } from './TeamsListScreenStyles';
import { APP_STRINGS } from '../../constants/appStrings';
import MyTeamCard from '../../components/MyTeamCard/MyTeamCard';
import TeamStatusTabs from '../../components/TeamStatusTabs/TeamStatusTabs';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Team } from '../../models/Team';
import { useTeamsListViewModel } from '../../viewModels/TeamListScreenViewModel';

const TeamsListScreen = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const viewModel = useTeamsListViewModel();

  const renderItem = ({ item }: { item: Team }) => (
    <MyTeamCard
      logo={
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>{item.name[0]}</Text>
        </View>
      }
      name={item.name}
      members={[item.captain]}
      sport={item.sport}
      wins={item.wins}
      losses={item.losses}
      winRate={viewModel.getWinRate(item)}
    />
  );

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.heading}>{APP_STRINGS.eventScreen.teams}</Text>

        <TeamStatusTabs
          activeTab={viewModel.activeTab}
          onChange={viewModel.setActiveTab}
        />

        {viewModel.teams.length === 0 ? (
          <Text style={styles.noTeamStyle}>
            {APP_STRINGS.eventScreen.noTeamsFound}
          </Text>
        ) : (
          <FlatList
            data={viewModel.teams}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: tabBarHeight + 65,
            }}
          />
        )}
      </View>
    </ScreenWrapper>
  );
};

export default TeamsListScreen;
