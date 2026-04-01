import React from 'react';
import {
  Text, View, Pressable, FlatList, TextInput,
  ActivityIndicator, ScrollView,
} from 'react-native';
import {
  ArrowLeft, User, Users, Search,
  Minus, Plus, X, ChevronLeft, ChevronUp, ChevronDown,
} from 'lucide-react-native';
import ScreenWrapper from '../../components/ScreenWrapper/ScreenWrapper';
import AppButton from '../../components/AppButton/AppButton';
import MyTeamCard from '../../components/MyTeamCard/MyTeamCard';
import FixtureManageCard from '../../components/FixtureManageCard/FixtureManageCard';
import { colors } from '../../theme/colors';
import { categoryDetailsStyles as s } from './CategoryDetailsScreenStyles';
import { APP_STRINGS } from '../../constants/appStrings';
import { useCategoryDetailsScreenViewModel, MONTHS } from '../../viewModels/CategoryDetailsScreenViewModel';
import { FixtureTabType, FormatType, GenderType } from '../../models/Event';
import { formatDisplayDateTime } from '../../utils/dateUtils';

const FIXTURE_TABS: FixtureTabType[] = [
  FixtureTabType.ALL,
  FixtureTabType.LIVE,
  FixtureTabType.UPCOMING,
  FixtureTabType.COMPLETED,
];

type StepperProps = {
  label: string;
  value: string;
  onUp: () => void;
  onDown: () => void;
  flex?: number;
};

const Stepper = ({ label, value, onUp, onDown, flex = 1 }: StepperProps) => (
  <View style={[s.stepCol, { flex }]}>
    <Text style={s.stepLabel}>{label}</Text>
    <View style={s.stepBox}>
      <Pressable onPress={onUp} style={s.stepArrow} hitSlop={10}>
        <ChevronUp size={18} color={colors.primary} />
      </Pressable>
      <Text style={s.stepValue}>{value}</Text>
      <Pressable onPress={onDown} style={s.stepArrow} hitSlop={10}>
        <ChevronDown size={18} color={colors.primary} />
      </Pressable>
    </View>
  </View>
);

const CategoryDetailsScreen = () => {
  const vm = useCategoryDetailsScreenViewModel();

  if (vm.loading) {
    return (
      <ScreenWrapper>
        <View style={s.emptyState}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  if (!vm.category) {
    return (
      <ScreenWrapper>
        <Text style={s.errorText}>{APP_STRINGS.eventScreen.noEventFound}</Text>
      </ScreenWrapper>
    );
  }

  const {
    gender, format: eventFormat, navigation,
    mainTabs, activeMainTab, setActiveMainTab,
    activeFixtureTab, setActiveFixtureTab,
    searchQuery, setSearchQuery,
    participants, teams, filteredFixtures,
    isAdminOrOrganizer, canManageEvent, isAbandoned,
    canCreateTeams, canCreateFixtures, minRequiredForTeams,
    hasTeamsForGender, hasFixturesForGender,
    getRoundName, handleCreateTeams, handleCreateFixtures, handleFixturePress,
    goLiveFixture, goLiveTotalSets, goLiveLoading,
    handleCloseGoLiveModal, adjustGoLiveSets, handleConfirmGoLive,
    eventVenue, eventName, event, role,
    showRescheduleModal, rescheduleFixture, rescheduleStep,
    rDay, rMonth, rYear, rHour12, rMinute, rAmPm,
    adjustDay, adjustMonth, adjustYear, adjustHour, adjustMinute, toggleAmPm,
    rescheduleLoading, rescheduleError,
    upcomingFixtures,
    handleOpenReschedule, handleCloseReschedule,
    handleSelectRescheduleFixture,
    handleBackToSelect, handleConfirmReschedule,
  } = vm;

  const { refreshing, handleRefresh } = vm;
  const showSearchBar = activeMainTab === 'TEAMS' || activeMainTab === 'FIXTURES';
  const shouldShowRescheduleBtn = canManageEvent && hasFixturesForGender && upcomingFixtures.length > 0;

  const pad = (n: number) => String(n).padStart(2, '0');
  const summaryText = `${pad(rDay)} ${MONTHS[rMonth]} ${rYear}   ${pad(rHour12)}:${pad(rMinute)} ${rAmPm}`;

  return (
    <View style={{ flex: 1 }}>
      <ScreenWrapper scrollable={false}>
        <View style={s.container}>

          <View style={s.header}>
            <Pressable onPress={() => navigation.goBack()} style={s.backButton}>
              <ArrowLeft size={24} color={colors.textPrimary} />
            </Pressable>
            <Text style={s.headerTitle}>
              {gender === GenderType.Male
                ? APP_STRINGS.eventScreen.mens
                : gender === GenderType.Female
                ? APP_STRINGS.eventScreen.womens
                : APP_STRINGS.eventScreen.mixed}{' '}
              {eventFormat}
              {isAbandoned && APP_STRINGS.eventScreen.abandonedLabel}
            </Text>
            <View style={s.headerRight} />
          </View>

          <View style={s.mainTabRow}>
            {mainTabs.map((tab) => (
              <Pressable
                key={tab}
                onPress={() => setActiveMainTab(tab)}
                style={[s.mainTabButton, activeMainTab === tab && s.activeMainTab]}
              >
                <Text style={[s.mainTabText, activeMainTab === tab && s.activeMainTabText]}>
                  {tab}
                </Text>
              </Pressable>
            ))}
          </View>

          {showSearchBar && (
            <View style={s.searchContainer}>
              <Search size={20} color={colors.textSecondary} />
              <TextInput
                style={s.searchInput}
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

          <View style={s.content}>

            {activeMainTab === 'PARTICIPANTS' && (
              <FlatList
                data={participants}
                keyExtractor={(item) => item.id}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                contentContainerStyle={s.listContent}
                renderItem={({ item, index }) => (
                  <View style={s.participantCard}>
                    <View style={s.participantAvatar}>
                      <User size={20} color={colors.primary} />
                    </View>
                    <View style={s.participantInfo}>
                      <Text style={s.participantName}>{item.name}</Text>
                      <Text style={s.participantIndex}>#{index + 1}</Text>
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
                    contentContainerStyle={s.listContent}
                    renderItem={({ item }) => (
                      <MyTeamCard
                        logo={<Users color={colors.appBackground} />}
                        name={item.name}
                        members={item.members}
                        sport={event?.sport ?? ''}
                        wins={0} losses={0} winRate="0%"
                      />
                    )}
                  />
                ) : (
                  canManageEvent && (
                    <View style={s.centerButton}>
                      {!canCreateTeams && (
                        <Text style={s.thresholdText}>
                          {APP_STRINGS.goLiveModal.minimumParticipants(minRequiredForTeams)}
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
              <View style={s.fixturesContainer}>
                <View style={s.fixtureTabRow}>
                  {FIXTURE_TABS.map((tab) => (
                    <Pressable
                      key={tab}
                      onPress={() => setActiveFixtureTab(tab)}
                      style={[s.fixtureTabButton, activeFixtureTab === tab && s.activeFixtureTab]}
                    >
                      <Text style={[s.fixtureTabText, activeFixtureTab === tab && s.activeFixtureTabText]}>
                        {tab}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                {shouldShowRescheduleBtn && (
                  <View style={s.rescheduleButtonRow}>
                    <Pressable
                      style={s.rescheduleButton}
                      onPress={handleOpenReschedule}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    >
                      <Text style={s.rescheduleButtonText}>
                        {APP_STRINGS.rescheduleModal.button}
                      </Text>
                    </Pressable>
                  </View>
                )}

                {hasFixturesForGender ? (
                  <FlatList
                    data={filteredFixtures}
                    keyExtractor={(item) => String(item.id)}
                    contentContainerStyle={s.listContent}
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
                      />
                    )}
                  />
                ) : (
                  canManageEvent && eventFormat === FormatType.Singles && (
                    <View style={s.centerButton}>
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

      {!!goLiveFixture && (
        <View style={s.overlay} pointerEvents="box-none">
          <Pressable style={s.backdrop} onPress={handleCloseGoLiveModal} />
          <View style={s.modalSheet}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{APP_STRINGS.goLiveModal.title}</Text>
              <Pressable onPress={handleCloseGoLiveModal}>
                <X size={22} color={colors.textPrimary} />
              </Pressable>
            </View>
            <Text style={s.modalLabel}>{APP_STRINGS.goLiveModal.selectSets}</Text>
            <Text style={s.modalSubLabel}>{APP_STRINGS.goLiveModal.mustBeOdd}</Text>
            <View style={s.setsRow}>
              <Pressable style={s.setsBtn} onPress={() => adjustGoLiveSets(-2)} disabled={goLiveTotalSets <= 1}>
                <Minus size={20} color={colors.textPrimary} />
              </Pressable>
              <Text style={s.setsValue}>{goLiveTotalSets}</Text>
              <Pressable style={s.setsBtn} onPress={() => adjustGoLiveSets(2)} disabled={goLiveTotalSets >= 9}>
                <Plus size={20} color={colors.textPrimary} />
              </Pressable>
            </View>
            <Text style={s.setsHint}>
              {APP_STRINGS.goLiveModal.bestOfSummary(goLiveTotalSets, Math.ceil(goLiveTotalSets / 2))}
            </Text>
            <AppButton
              title={goLiveLoading ? APP_STRINGS.matchScreen.starting : APP_STRINGS.goLiveModal.confirmGoLive}
              onPress={handleConfirmGoLive}
              disabled={goLiveLoading}
            />
          </View>
        </View>
      )}

      {showRescheduleModal && (
        <View style={s.overlay} pointerEvents="box-none">
          <Pressable style={s.backdrop} onPress={handleCloseReschedule} />
          <View style={s.sheet}>

            {rescheduleStep === 'select' && (
              <>
                <View style={s.modalHeader}>
                  <Text style={s.modalTitle}>{APP_STRINGS.rescheduleModal.title}</Text>
                  <Pressable onPress={handleCloseReschedule}>
                    <X size={22} color={colors.textPrimary} />
                  </Pressable>
                </View>

                <Text style={s.modalLabel}>{APP_STRINGS.rescheduleModal.selectMatch}</Text>

                {upcomingFixtures.length === 0 ? (
                  <Text style={s.noMatchesText}>{APP_STRINGS.rescheduleModal.noUpcomingMatches}</Text>
                ) : (
                  <ScrollView style={s.matchSelectList} showsVerticalScrollIndicator={false}>
                    {upcomingFixtures.map((f) => (
                      <Pressable
                        key={f.id}
                        style={s.matchSelectItem}
                        onPress={() => handleSelectRescheduleFixture(f)}
                      >
                        <Text style={s.matchSelectName}>
                          {f.sideAName ?? 'TBD'} {APP_STRINGS.matchScreen.vs} {f.sideBName ?? 'TBD'}
                        </Text>
                        <Text style={s.matchSelectTime}>
                          {f.matchDateTime ? formatDisplayDateTime(f.matchDateTime) : APP_STRINGS.fixtureScreen.tbd}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                )}

                <Pressable style={[s.rescheduleBackBtn, { marginTop: 12 }]} onPress={handleCloseReschedule}>
                  <Text style={s.rescheduleBackBtnText}>{APP_STRINGS.buttons.cancel}</Text>
                </Pressable>
              </>
            )}

            {rescheduleStep === 'datetime' && rescheduleFixture && (
              <>
                <View style={s.modalHeader}>
                  <Pressable onPress={handleBackToSelect} style={s.backButton}>
                    <ChevronLeft size={22} color={colors.textPrimary} />
                  </Pressable>
                  <Text style={s.modalTitle}>{APP_STRINGS.rescheduleModal.selectDateTime}</Text>
                  <Pressable onPress={handleCloseReschedule}>
                    <X size={22} color={colors.textPrimary} />
                  </Pressable>
                </View>

                <View style={s.matchCard}>
                  <Text style={s.matchName}>
                    {rescheduleFixture.sideAName ?? 'TBD'} {APP_STRINGS.matchScreen.vs} {rescheduleFixture.sideBName ?? 'TBD'}
                  </Text>
                  <Text style={s.matchCurrent}>
                    {rescheduleFixture.matchDateTime
                      ? formatDisplayDateTime(rescheduleFixture.matchDateTime)
                      : APP_STRINGS.fixtureScreen.tbd}
                  </Text>
                </View>

                <Text style={s.sectionLabel}>{APP_STRINGS.rescheduleModal.date}</Text>
                <View style={s.pickerRow}>
                  <Stepper
                    label="Day"
                    value={pad(rDay)}
                    onUp={() => adjustDay(1)}
                    onDown={() => adjustDay(-1)}
                  />
                  <Stepper
                    label="Month"
                    value={MONTHS[rMonth]}
                    onUp={() => adjustMonth(1)}
                    onDown={() => adjustMonth(-1)}
                    flex={2}
                  />
                  <Stepper
                    label="Year"
                    value={String(rYear)}
                    onUp={() => adjustYear(1)}
                    onDown={() => adjustYear(-1)}
                    flex={2}
                  />
                </View>

                <Text style={[s.sectionLabel, { marginTop: 14 }]}>{APP_STRINGS.rescheduleModal.time}</Text>
                <View style={s.pickerRow}>
                  <Stepper
                    label="Hour"
                    value={pad(rHour12)}
                    onUp={() => adjustHour(1)}
                    onDown={() => adjustHour(-1)}
                  />
                  <Stepper
                    label="Min"
                    value={pad(rMinute)}
                    onUp={() => adjustMinute(5)}
                    onDown={() => adjustMinute(-5)}
                  />
                  <View style={[s.stepCol, { flex: 1 }]}>
                    <Text style={s.stepLabel}>AM/PM</Text>
                    <View style={s.ampmWrap}>
                      <Pressable
                        style={[s.ampmBtn, rAmPm === 'AM' && s.ampmBtnActive]}
                        onPress={() => { if (rAmPm !== 'AM') toggleAmPm(); }}
                      >
                        <Text style={[s.ampmText, rAmPm === 'AM' && s.ampmTextActive]}>AM</Text>
                      </Pressable>
                      <View style={s.ampmDivider} />
                      <Pressable
                        style={[s.ampmBtn, rAmPm === 'PM' && s.ampmBtnActive]}
                        onPress={() => { if (rAmPm !== 'PM') toggleAmPm(); }}
                      >
                        <Text style={[s.ampmText, rAmPm === 'PM' && s.ampmTextActive]}>PM</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>

                <View style={s.summary}>
                  <Text style={s.summaryText}>{summaryText}</Text>
                </View>

                <Text style={s.rescheduleNote}>{APP_STRINGS.rescheduleModal.noteShift}</Text>

                {!!rescheduleError && (
                  <Text style={s.errorText}>{rescheduleError}</Text>
                )}

                <View style={s.rescheduleActions}>
                  <Pressable
                    style={s.rescheduleBackBtn}
                    onPress={handleBackToSelect}
                    disabled={rescheduleLoading}
                  >
                    <Text style={s.rescheduleBackBtnText}>{APP_STRINGS.buttons.cancel}</Text>
                  </Pressable>
                  <AppButton
                    title={rescheduleLoading ? APP_STRINGS.rescheduleModal.rescheduling : APP_STRINGS.rescheduleModal.confirm}
                    onPress={handleConfirmReschedule}
                    disabled={rescheduleLoading}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default CategoryDetailsScreen;