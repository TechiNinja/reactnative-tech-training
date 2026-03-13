// import React from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   Pressable,
//   Modal,
//   ActivityIndicator,
//   Platform,
// } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import {
//   ArrowLeft,
//   Calendar,
//   MapPin,
//   Minus,
//   Plus,
//   Pencil,
//   CheckCircle,
//   X,
//   RefreshCw,
//   User,
//   Users,
// } from 'lucide-react-native';
// import ScreenWrapper from '../../components/ScreenWrapper/ScreenWrapper';
// import AppButton from '../../components/AppButton/AppButton';
// import { colors } from '../../theme/colors';
// import { styles } from './MatchDetailsScreenStyles';
// import { useMatchDetailsViewModel } from './MatchDetailsScreenViewModel';
// import { FormatType } from '../../models/Event';

// const formatDate = (iso: string) =>
//   new Date(iso).toLocaleDateString('en-IN', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric',
//   });

// const formatTime = (iso: string) =>
//   new Date(iso).toLocaleTimeString('en-IN', {
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true,
//   });

// const MatchDetailsScreen = () => {
//   const vm = useMatchDetailsViewModel();

//   if (vm.loading) {
//     return (
//       <ScreenWrapper>
//         <View style={styles.centered}>
//           <ActivityIndicator size="large" color={colors.primary} />
//         </View>
//       </ScreenWrapper>
//     );
//   }

//   if (vm.error || !vm.fixture) {
//     return (
//       <ScreenWrapper>
//         <View style={styles.centered}>
//           <Text style={styles.errorText}>{vm.error ?? 'Match not found'}</Text>
//           <AppButton title="Retry" onPress={vm.fetchMatch} />
//         </View>
//       </ScreenWrapper>
//     );
//   }

//   const { fixture, sets } = vm;

//   const renderSet = (set: (typeof sets)[0], index: number) => {
//     const isActive = index === vm.currentActiveSetIndex && vm.isLive;
//     const isCompleted = set.status === 'Completed';
//     const isLocked =
//       vm.currentActiveSetIndex !== null
//         ? index > vm.currentActiveSetIndex
//         : index > sets.length;
//     const aWon = set.scoreA > set.scoreB;
//     const bWon = set.scoreB > set.scoreA;

//     return (
//       <Pressable
//         key={set.id}
//         style={[
//           styles.setRow,
//           isActive && styles.setRowActive,
//           isCompleted && styles.setRowCompleted,
//           isLocked && styles.setRowLocked,
//         ]}
//         onPress={() =>
//           vm.isOrganizer && isActive ? vm.openSetEditor(index) : undefined
//         }
//         disabled={!vm.isOrganizer || !isActive}
//       >
//         <Text style={styles.setLabel}>Set {set.setNumber}</Text>
//         <View style={styles.setScores}>
//           <Text
//             style={[
//               styles.setScore,
//               aWon && isCompleted && styles.setScoreWinner,
//             ]}
//           >
//             {set.scoreA}
//           </Text>
//           <Text style={styles.setDash}>—</Text>
//           <Text
//             style={[
//               styles.setScore,
//               bWon && isCompleted && styles.setScoreWinner,
//             ]}
//           >
//             {set.scoreB}
//           </Text>
//         </View>
//         <View style={styles.setStatus}>
//           <View
//             style={[
//               styles.setStatusBadge,
//               set.status === 'Live' && styles.setStatusLive,
//               set.status === 'Completed' && styles.setStatusCompleted,
//               set.status === 'NotStarted' && styles.setStatusNotStarted,
//             ]}
//           >
//             <Text
//               style={[
//                 styles.setStatusText,
//                 set.status === 'Live' && styles.setStatusTextLive,
//                 set.status === 'Completed' && styles.setStatusTextCompleted,
//                 set.status === 'NotStarted' && styles.setStatusTextNotStarted,
//               ]}
//             >
//               {set.status === 'NotStarted' ? 'Pending' : set.status}
//             </Text>
//           </View>
//           {vm.isOrganizer && isActive && (
//             <Pencil size={14} color={colors.primary} style={styles.editIcon} />
//           )}
//         </View>
//       </Pressable>
//     );
//   };

//   return (
//     <ScreenWrapper scrollable={false}>
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <Pressable
//             onPress={() => vm.navigation.goBack()}
//             style={styles.backButton}
//           >
//             <ArrowLeft size={24} color={colors.textPrimary} />
//           </Pressable>
//           <Text style={styles.headerTitle}>Match Details</Text>
//           <Pressable onPress={vm.fetchMatch} style={styles.backButton}>
//             <RefreshCw size={20} color={colors.textSecondary} />
//           </Pressable>
//         </View>

//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={false}
//         >
//           <View style={styles.statusRow}>
//             <Text style={styles.roundLabel}>Round {fixture.roundNumber}</Text>
//             <View
//               style={[
//                 styles.statusBadge,
//                 vm.isLive && styles.statusLive,
//                 vm.isUpcoming && styles.statusUpcoming,
//                 vm.isCompleted && styles.statusCompleted,
//               ]}
//             >
//               {vm.isLive ? (
//                 <View style={styles.liveBadgeRow}>
//                   <View style={styles.liveDot} />
//                   <Text style={[styles.statusText, styles.statusTextLive]}>
//                     LIVE
//                   </Text>
//                 </View>
//               ) : (
//                 <Text
//                   style={[
//                     styles.statusText,
//                     vm.isUpcoming && styles.statusTextUpcoming,
//                     vm.isCompleted && styles.statusTextCompleted,
//                   ]}
//                 >
//                   {fixture.status.toUpperCase()}
//                 </Text>
//               )}
//             </View>
//           </View>

//           <View style={styles.scoreboardCard}>
//             <View style={styles.scoreboardRow}>
//               <View style={styles.teamBlock}>
//                 <View
//                   style={[
//                     styles.teamAvatar,
//                     !fixture.sideAId && styles.teamAvatarTBD,
//                   ]}
//                 >
//                   <User
//                     size={22}
//                     color={
//                       fixture.sideAId
//                         ? colors.appBackground
//                         : colors.textSecondary
//                     }
//                   />
//                 </View>
//                 <Text
//                   style={[
//                     styles.teamName,
//                     !fixture.sideAId && styles.teamNameTBD,
//                   ]}
//                   numberOfLines={2}
//                 >
//                   {fixture.sideAName || 'TBD'}
//                 </Text>
//                 <Text
//                   style={[
//                     styles.setsWon,
//                     vm.isCompleted &&
//                       vm.setsWonA > vm.setsWonB &&
//                       styles.setsWonWinner,
//                   ]}
//                 >
//                   {vm.setsWonA}
//                 </Text>
//               </View>

//               <View style={styles.vsBlock}>
//                 <Text style={styles.vsText}>VS</Text>
//               </View>

//               <View style={styles.teamBlock}>
//                 <View
//                   style={[
//                     styles.teamAvatar,
//                     !fixture.sideBId && styles.teamAvatarTBD,
//                   ]}
//                 >
//                   <User
//                     size={22}
//                     color={
//                       fixture.sideBId
//                         ? colors.appBackground
//                         : colors.textSecondary
//                     }
//                   />
//                 </View>
//                 <Text
//                   style={[
//                     styles.teamName,
//                     !fixture.sideBId && styles.teamNameTBD,
//                   ]}
//                   numberOfLines={2}
//                 >
//                   {fixture.sideBName || 'TBD'}
//                 </Text>
//                 <Text
//                   style={[
//                     styles.setsWon,
//                     vm.isCompleted &&
//                       vm.setsWonB > vm.setsWonA &&
//                       styles.setsWonWinner,
//                   ]}
//                 >
//                   {vm.setsWonB}
//                 </Text>
//               </View>
//             </View>

//             {vm.isCompleted && vm.matchWinner && (
//               <View style={styles.winnerBanner}>
//                 <CheckCircle size={16} color={colors.participantBackgroud} />
//                 <Text style={styles.winnerText}>Winner: {vm.matchWinner}</Text>
//               </View>
//             )}
//           </View>

//           <View style={styles.infoCard}>
//             {fixture.matchVenue ? (
//               <View style={styles.infoRow}>
//                 <MapPin size={18} color={colors.textSecondary} />
//                 <Text style={styles.infoText}>{fixture.matchVenue}</Text>
//               </View>
//             ) : null}
//             {fixture.matchDateTime ? (
//               <View style={styles.infoRow}>
//                 <Calendar size={18} color={colors.textSecondary} />
//                 <View>
//                   <Text style={styles.infoText}>
//                     {formatDate(fixture.matchDateTime)}
//                   </Text>
//                   <Text style={styles.infoMuted}>
//                     {formatTime(fixture.matchDateTime)}
//                   </Text>
//                 </View>
//               </View>
//             ) : (
//               <View style={styles.infoRow}>
//                 <Calendar size={18} color={colors.textSecondary} />
//                 <Text style={[styles.infoText, { color: colors.textSecondary }]}>
//                   Not scheduled yet
//                 </Text>
//               </View>
//             )}
//           </View>

//           {fixture.totalSets > 0 && (
//             <>
//               <Text style={styles.sectionTitle}>
//                 Sets ({fixture.totalSets} total)
//               </Text>
//               {sets.length > 0
//                 ? sets.map((s, i) => renderSet(s, i))
//                 : Array.from({ length: fixture.totalSets }).map((_, i) => (
//                     <View
//                       key={i}
//                       style={[styles.setRow, styles.setRowLocked]}
//                     >
//                       <Text style={styles.setLabel}>Set {i + 1}</Text>
//                       <View style={styles.setScores}>
//                         <Text style={styles.setScore}>0</Text>
//                         <Text style={styles.setDash}>—</Text>
//                         <Text style={styles.setScore}>0</Text>
//                       </View>
//                       <View style={styles.setStatus}>
//                         <View style={styles.setStatusNotStarted}>
//                           <Text style={styles.setStatusTextNotStarted}>
//                             Pending
//                           </Text>
//                         </View>
//                       </View>
//                     </View>
//                   ))}
//             </>
//           )}

//           {vm.isOrganizer && vm.isUpcoming && (
//             <View style={styles.actionRow}>
//               <Pressable
//                 style={styles.primaryButton}
//                 onPress={vm.openScheduleModal}
//               >
//                 <Text style={styles.primaryButtonText}>
//                   {fixture.matchDateTime
//                     ? 'Reschedule Match'
//                     : 'Schedule Match'}
//                 </Text>
//               </Pressable>
//             </View>
//           )}
//         </ScrollView>

//         <Modal
//           visible={vm.showScheduleModal}
//           animationType="slide"
//           transparent
//         >
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContainer}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Schedule Match</Text>
//                 <Pressable onPress={() => vm.setShowScheduleModal(false)}>
//                   <X size={24} color={colors.textSecondary} />
//                 </Pressable>
//               </View>

//               <Text style={styles.modalLabel}>Date</Text>
//               <Pressable
//                 style={styles.dateTimeButton}
//                 onPress={() => vm.setShowDatePicker(true)}
//               >
//                 <Calendar size={18} color={colors.textSecondary} />
//                 <Text style={styles.dateTimeButtonText}>
//                   {vm.scheduledDate.toLocaleDateString('en-IN', {
//                     day: '2-digit',
//                     month: 'short',
//                     year: 'numeric',
//                   })}
//                 </Text>
//               </Pressable>

//               {vm.showDatePicker && (
//                 <DateTimePicker
//                   value={vm.scheduledDate}
//                   mode="date"
//                   display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                   minimumDate={vm.minDate}
//                   maximumDate={vm.maxDate}
//                   onChange={vm.onDateChange}
//                 />
//               )}

//               <Text style={styles.modalLabel}>Time</Text>
//               <Pressable
//                 style={styles.dateTimeButton}
//                 onPress={() => vm.setShowTimePicker(true)}
//               >
//                 <Calendar size={18} color={colors.textSecondary} />
//                 <Text style={styles.dateTimeButtonText}>
//                   {vm.scheduledDate.toLocaleTimeString('en-IN', {
//                     hour: '2-digit',
//                     minute: '2-digit',
//                     hour12: true,
//                   })}
//                 </Text>
//               </Pressable>

//               {vm.showTimePicker && (
//                 <DateTimePicker
//                   value={vm.scheduledDate}
//                   mode="time"
//                   display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                   onChange={vm.onTimeChange}
//                 />
//               )}

//               <Text style={styles.modalLabel}>Total Sets</Text>
//               <View style={styles.setsRow}>
//                 <Pressable
//                   style={styles.setsCountBtn}
//                   onPress={() => vm.setTotalSets((p) => Math.max(1, p - 2))}
//                 >
//                   <Minus size={18} color={colors.textPrimary} />
//                 </Pressable>
//                 <Text style={styles.setsCount}>{vm.totalSets}</Text>
//                 <Pressable
//                   style={styles.setsCountBtn}
//                   onPress={() => vm.setTotalSets((p) => Math.min(9, p + 2))}
//                 >
//                   <Plus size={18} color={colors.textPrimary} />
//                 </Pressable>
//               </View>
//               <Text style={styles.infoMuted}>
//                 Sets must be odd (1, 3, 5, 7, 9) to avoid ties
//               </Text>

//               <Pressable
//                 style={[
//                   styles.scheduleButton,
//                   vm.scheduling && styles.disabledButton,
//                 ]}
//                 onPress={vm.handleSchedule}
//                 disabled={vm.scheduling}
//               >
//                 {vm.scheduling ? (
//                   <ActivityIndicator color={colors.primaryText} />
//                 ) : (
//                   <Text style={styles.scheduleButtonText}>
//                     Confirm Schedule
//                   </Text>
//                 )}
//               </Pressable>
//             </View>
//           </View>
//         </Modal>

//         <Modal
//           visible={vm.activeSetIndex !== null}
//           animationType="slide"
//           transparent
//         >
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContainer}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>
//                   Update Set{' '}
//                   {vm.activeSetIndex !== null ? vm.activeSetIndex + 1 : ''}
//                 </Text>
//                 <Pressable onPress={vm.closeSetEditor}>
//                   <X size={24} color={colors.textSecondary} />
//                 </Pressable>
//               </View>

//               <View style={styles.setEditorScoreRow}>
//                 <View style={styles.setEditorTeamBlock}>
//                   <Text style={styles.setEditorTeamName} numberOfLines={1}>
//                     {fixture.sideAName || 'Side A'}
//                   </Text>
//                   <View style={styles.setEditorControls}>
//                     <Pressable
//                       style={styles.setEditorBtn}
//                       onPress={() => vm.decrementScore('A')}
//                     >
//                       <Minus size={20} color={colors.textPrimary} />
//                     </Pressable>
//                     <Text style={styles.setEditorScore}>{vm.tempScoreA}</Text>
//                     <Pressable
//                       style={styles.setEditorBtn}
//                       onPress={() => vm.incrementScore('A')}
//                     >
//                       <Plus size={20} color={colors.textPrimary} />
//                     </Pressable>
//                   </View>
//                 </View>

//                 <View style={styles.setEditorTeamBlock}>
//                   <Text style={styles.setEditorTeamName} numberOfLines={1}>
//                     {fixture.sideBName || 'Side B'}
//                   </Text>
//                   <View style={styles.setEditorControls}>
//                     <Pressable
//                       style={styles.setEditorBtn}
//                       onPress={() => vm.decrementScore('B')}
//                     >
//                       <Minus size={20} color={colors.textPrimary} />
//                     </Pressable>
//                     <Text style={styles.setEditorScore}>{vm.tempScoreB}</Text>
//                     <Pressable
//                       style={styles.setEditorBtn}
//                       onPress={() => vm.incrementScore('B')}
//                     >
//                       <Plus size={20} color={colors.textPrimary} />
//                     </Pressable>
//                   </View>
//                 </View>
//               </View>

//               <View style={styles.setEditorActions}>
//                 <Pressable
//                   style={[
//                     styles.secondaryButton,
//                     vm.savingSet && styles.disabledButton,
//                   ]}
//                   onPress={() => vm.handleSaveSet(false)}
//                   disabled={vm.savingSet}
//                 >
//                   <Text style={styles.secondaryButtonText}>Save Score</Text>
//                 </Pressable>

//                 {vm.tempScoreA !== vm.tempScoreB ? (
//                   <Pressable
//                     style={[
//                       styles.primaryButton,
//                       vm.savingSet && styles.disabledButton,
//                     ]}
//                     onPress={() => vm.handleSaveSet(true)}
//                     disabled={vm.savingSet}
//                   >
//                     {vm.savingSet ? (
//                       <ActivityIndicator color={colors.primaryText} />
//                     ) : (
//                       <Text style={styles.primaryButtonText}>Complete Set</Text>
//                     )}
//                   </Pressable>
//                 ) : (
//                   <Text style={styles.tieWarning}>
//                     Scores must differ to complete the set
//                   </Text>
//                 )}
//               </View>
//             </View>
//           </View>
//         </Modal>
//       </View>
//     </ScreenWrapper>
//   );
// };

// export default MatchDetailsScreen;