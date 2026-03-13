// import { useState, useEffect, useCallback, useRef } from 'react';
// import { Alert } from 'react-native';
// import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../navigation/AppNavigator';
// import { useEventStore } from '../../store/EventStore';
// import { getToken } from '../../utils/authStorage';
// import {
//   getMatchById,
//   getMatchSets,
//   updateSetScore,
//   bulkScheduleFixtures,
// } from '../../services/matchService';
// import { FixtureResponse, MatchSetResponse } from '../../models/ApiResponses';

// type MatchDetailsRouteProp = RouteProp<RootStackParamList, 'MatchDetails'>;

// export const useMatchDetailsViewModel = () => {
//   const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
//   const route = useRoute<MatchDetailsRouteProp>();
//   const { fixtureId, eventId, catId, isOrganizer } = route.params;

//   const { events, updateFixtureFromBackend } = useEventStore();

//   const event = events.find((e) => e.id === eventId) ?? null;
//   const localFixture = event?.fixtures.find((f) => f.id === fixtureId) ?? null;

//   const [fixture, setFixture] = useState<FixtureResponse | null>(null);
//   const [sets, setSets] = useState<MatchSetResponse[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [showScheduleModal, setShowScheduleModal] = useState(false);
//   const [scheduledDate, setScheduledDate] = useState<Date>(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showTimePicker, setShowTimePicker] = useState(false);
//   const [totalSets, setTotalSets] = useState(1);
//   const [scheduling, setScheduling] = useState(false);

//   const [activeSetIndex, setActiveSetIndex] = useState<number | null>(null);
//   const [tempScoreA, setTempScoreA] = useState(0);
//   const [tempScoreB, setTempScoreB] = useState(0);
//   const [savingSet, setSavingSet] = useState(false);

//   const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const backendId = localFixture?.backendId;

//   const fetchMatch = useCallback(async () => {
//     if (!backendId) return;
//     const token = await getToken();
//     if (!token) return;
//     try {
//       const [matchData, setsData] = await Promise.all([
//         getMatchById(backendId, token),
//         getMatchSets(backendId, token),
//       ]);
//       setFixture(matchData);
//       setSets(setsData);
//       setError(null);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to load match');
//     } finally {
//       setLoading(false);
//     }
//   }, [backendId]);

//   useEffect(() => {
//     fetchMatch();
//   }, [fetchMatch]);

//   useEffect(() => {
//     if (fixture?.status === 'Live') {
//       pollRef.current = setInterval(fetchMatch, 5000);
//     } else {
//       if (pollRef.current) clearInterval(pollRef.current);
//     }
//     return () => {
//       if (pollRef.current) clearInterval(pollRef.current);
//     };
//   }, [fixture?.status, fetchMatch]);

//   const isLive = fixture?.status === 'Live';
//   const isUpcoming = fixture?.status === 'Upcoming';
//   const isCompleted = fixture?.status === 'Completed';

//   const currentActiveSetIndex = (() => {
//     for (let i = 0; i < sets.length; i++) {
//       if (sets[i].status !== 'Completed') return i;
//     }
//     return null;
//   })();

//   const setsWonA = sets.filter(
//     (s) => s.status === 'Completed' && s.scoreA > s.scoreB,
//   ).length;
//   const setsWonB = sets.filter(
//     (s) => s.status === 'Completed' && s.scoreB > s.scoreA,
//   ).length;

//   const matchWinner = (() => {
//     if (!isCompleted || !fixture) return null;
//     if (setsWonA > setsWonB) return fixture.sideAName;
//     if (setsWonB > setsWonA) return fixture.sideBName;
//     return null;
//   })();

//   const minDate = event?.startDate ? new Date(event.startDate) : new Date();
//   const maxDate = event?.endDate ? new Date(event.endDate) : new Date();

//   const openScheduleModal = () => {
//     if (fixture?.matchDateTime) setScheduledDate(new Date(fixture.matchDateTime));
//     setTotalSets(fixture?.totalSets || 1);
//     setShowScheduleModal(true);
//   };

//   const onDateChange = (_: unknown, selected?: Date) => {
//     setShowDatePicker(false);
//     if (selected) {
//       setScheduledDate((prev) => {
//         const next = new Date(selected);
//         next.setHours(prev.getHours(), prev.getMinutes());
//         return next;
//       });
//     }
//   };

//   const onTimeChange = (_: unknown, selected?: Date) => {
//     setShowTimePicker(false);
//     if (selected) {
//       setScheduledDate((prev) => {
//         const next = new Date(prev);
//         next.setHours(selected.getHours(), selected.getMinutes());
//         return next;
//       });
//     }
//   };

//   const handleSchedule = async () => {
//     if (!backendId || !catId) return;
//     const token = await getToken();
//     if (!token) return;
//     setScheduling(true);
//     try {
//       const updated = await bulkScheduleFixtures(
//         catId,
//         [{ matchId: backendId, matchDateTime: scheduledDate.toISOString(), totalSets }],
//         token,
//       );
//       if (updated[0]) {
//         setFixture(updated[0]);
//         const setsData = await getMatchSets(backendId, token);
//         setSets(setsData);
//         updateFixtureFromBackend(eventId, fixtureId, updated[0]);
//       }
//       setShowScheduleModal(false);
//     } catch (err) {
//       Alert.alert('Error', err instanceof Error ? err.message : 'Failed to schedule match');
//     } finally {
//       setScheduling(false);
//     }
//   };

//   const openSetEditor = (index: number) => {
//     if (!isLive) return;
//     if (index !== currentActiveSetIndex) return;
//     const s = sets[index];
//     setTempScoreA(s?.scoreA ?? 0);
//     setTempScoreB(s?.scoreB ?? 0);
//     setActiveSetIndex(index);
//   };

//   const closeSetEditor = () => setActiveSetIndex(null);

//   const incrementScore = (side: 'A' | 'B') => {
//     if (side === 'A') setTempScoreA((p) => p + 1);
//     else setTempScoreB((p) => p + 1);
//   };

//   const decrementScore = (side: 'A' | 'B') => {
//     if (side === 'A') setTempScoreA((p) => Math.max(0, p - 1));
//     else setTempScoreB((p) => Math.max(0, p - 1));
//   };

//   const handleSaveSet = async (complete: boolean) => {
//     if (activeSetIndex === null || !backendId) return;
//     if (complete && tempScoreA === tempScoreB) {
//       Alert.alert('Cannot complete set', 'Scores must be different to complete a set.');
//       return;
//     }
//     const token = await getToken();
//     if (!token) return;
//     setSavingSet(true);
//     try {
//       const response = await updateSetScore(
//         backendId,
//         { scoreA: tempScoreA, scoreB: tempScoreB, isCompleted: complete },
//         token,
//       );
//       setSets((prev) => prev.map((s) => (s.id === response.set.id ? response.set : s)));
//       if (response.result) await fetchMatch();
//       updateFixtureFromBackend(eventId, fixtureId, null, response);
//       closeSetEditor();
//     } catch (err) {
//       Alert.alert('Error', err instanceof Error ? err.message : 'Failed to save set score');
//     } finally {
//       setSavingSet(false);
//     }
//   };

//   return {
//     navigation,
//     fixture,
//     sets,
//     loading,
//     error,
//     isLive,
//     isUpcoming,
//     isCompleted,
//     isOrganizer,
//     currentActiveSetIndex,
//     setsWonA,
//     setsWonB,
//     matchWinner,
//     showScheduleModal,
//     setShowScheduleModal,
//     openScheduleModal,
//     scheduledDate,
//     showDatePicker,
//     setShowDatePicker,
//     showTimePicker,
//     setShowTimePicker,
//     onDateChange,
//     onTimeChange,
//     totalSets,
//     setTotalSets,
//     scheduling,
//     handleSchedule,
//     minDate,
//     maxDate,
//     activeSetIndex,
//     tempScoreA,
//     tempScoreB,
//     savingSet,
//     openSetEditor,
//     closeSetEditor,
//     incrementScore,
//     decrementScore,
//     handleSaveSet,
//     fetchMatch,
//   };
// };