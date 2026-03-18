import React from 'react';
import { Text, View, Pressable, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { ArrowLeft, User, Users, Search } from 'lucide-react-native';
import ScreenWrapper from '../../components/ScreenWrapper/ScreenWrapper';
import AppButton from '../../components/AppButton/AppButton';
import MyTeamCard from '../../components/MyTeamCard/MyTeamCard';
import FixtureManageCard from '../../components/FixtureManageCard/FixtureManageCard';
import { colors } from '../../theme/colors';
import { styles } from './CategoryDetailsScreenStyles';
import { APP_STRINGS } from '../../constants/AppStrings';
import { useCategoryDetailsScreenViewModel } from '../../viewModels/CategoryDetailsScreenViewModel';
import { FixtureTabType, FormatType, GenderType } from '../../models/Event';

const FIXTURE_TABS: FixtureTabType[] = [
  FixtureTabType.ALL,
  FixtureTabType.LIVE,
  FixtureTabType.UPCOMING,
  FixtureTabType.COMPLETED,
];

const CategoryDetailsScreen = () => {
  const viewModel = useCategoryDetailsScreenViewModel();

  if (viewModel.loading) {
    return (
      <ScreenWrapper>
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  if (!viewModel.category) {
    return (
      <ScreenWrapper>
        <Text style={styles.errorText}>{APP_STRINGS.eventScreen.noEventFound}</Text>
      </ScreenWrapper>
    );
  }

  const {
    gender,
    format,
    navigation,
    mainTabs,
    activeMainTab,
    setActiveMainTab,
    activeFixtureTab,
    setActiveFixtureTab,
    searchQuery,
    setSearchQuery,
    participants,
    teams,
    filteredFixtures,
    isAdminOrOrganizer,
    canManageEvent,
    isAbandoned,
    canCreateTeams,
    canCreateFixtures,
    minRequiredForTeams,
    hasTeamsForGender,
    hasFixturesForGender,
    getRoundName,
    handleCreateTeams,
    handleCreateFixtures,
    handleFixturePress,
    handleScheduleFixture,
    eventVenue,
    eventName,
    event,
  } = viewModel;
  const { refreshing, handleRefresh } = viewModel;
  const showSearchBar = activeMainTab === 'TEAMS' || activeMainTab === 'FIXTURES';

  return (
    <ScreenWrapper scrollable={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>
            {gender === GenderType.Male ? "Men's" : gender === GenderType.Female ? "Women's" : 'Mixed'}{' '}
            {format}
            {isAbandoned && ' (Abandoned)'}
          </Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.mainTabRow}>
          {mainTabs.map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveMainTab(tab)}
              style={[styles.mainTabButton, activeMainTab === tab && styles.activeMainTab]}
            >
              <Text style={[styles.mainTabText, activeMainTab === tab && styles.activeMainTabText]}>
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        {showSearchBar && (
          <View style={styles.searchContainer}>
            <Search size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder={
                activeMainTab === 'TEAMS'
                  ? APP_STRINGS.placeHolders.searchTeams
                  : APP_STRINGS.placeHolders.searchFixtures
              }
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        )}

        <View style={styles.content}>
          {activeMainTab === 'PARTICIPANTS' && (
            <FlatList
              data={participants}
              keyExtractor={(item) => item.id}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              contentContainerStyle={styles.listContent}
              renderItem={({ item, index }) => (
                <View style={styles.participantCard}>
                  <View style={styles.participantAvatar}>
                    <User size={20} color={colors.primary} />
                  </View>
                  <View style={styles.participantInfo}>
                    <Text style={styles.participantName}>{item.name}</Text>
                    <Text style={styles.participantIndex}>#{index + 1}</Text>
                  </View>
                </View>
              )}
            />
          )}

          {activeMainTab === 'TEAMS' && (
            <>
              {hasTeamsForGender ? (
                <FlatList
                  data={teams}
                  keyExtractor={(item) => item.id}
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  contentContainerStyle={styles.listContent}
                  renderItem={({ item }) => (
                    <MyTeamCard
                      logo={<Users color={colors.appBackground} />}
                      name={item.name}
                      members={item.members}
                      sport={event?.sport ?? ''}
                      wins={0}
                      losses={0}
                      winRate="0%"
                    />
                  )}
                />
              ) : (
                canManageEvent && (
                  <View style={styles.centerButton}>
                    {!canCreateTeams && (
                      <Text style={styles.thresholdText}>
                        Minimum {minRequiredForTeams} participants required
                      </Text>
                    )}
                    <AppButton
                      title={APP_STRINGS.eventScreen.createTeam}
                      onPress={handleCreateTeams}
                      disabled={!canCreateTeams}
                    />
                  </View>
                )
              )}
            </>
          )}

          {activeMainTab === 'FIXTURES' && (
            <View style={styles.fixturesContainer}>
              <View style={styles.fixtureTabRow}>
                {FIXTURE_TABS.map((tab) => (
                  <Pressable
                    key={tab}
                    onPress={() => setActiveFixtureTab(tab)}
                    style={[styles.fixtureTabButton, activeFixtureTab === tab && styles.activeFixtureTab]}
                  >
                    <Text style={[styles.fixtureTabText, activeFixtureTab === tab && styles.activeFixtureTabText]}>
                      {tab}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {hasFixturesForGender ? (
                <FlatList
                  data={filteredFixtures}
                  keyExtractor={(item) => String(item.id)}
                  contentContainerStyle={styles.listContent}
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  renderItem={({ item }) => (
                    <FixtureManageCard
                      fixture={item}
                      roundName={getRoundName(item.roundNumber, item.matchNumber)}
                      isOrganizer={isAdminOrOrganizer}
                      eventVenue={eventVenue}
                      eventName={eventName}
                      onPress={() => handleFixturePress(item)}
                      onSchedule={() => handleScheduleFixture(item)}
                    />
                  )}
                />
              ) : (
                canManageEvent && (
                  <View style={styles.centerButton}>
                    {!canCreateFixtures && format === FormatType.Doubles && (
                      <Text style={styles.thresholdText}>
                        {APP_STRINGS.eventScreen.createTeamFirst}
                      </Text>
                    )}
                    <AppButton
                      title={APP_STRINGS.eventScreen.createFixtures}
                      onPress={handleCreateFixtures}
                      disabled={!canCreateFixtures}
                    />
                  </View>
                )
              )}
            </View>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default CategoryDetailsScreen;