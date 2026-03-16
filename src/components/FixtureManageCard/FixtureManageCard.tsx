import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { User, Calendar, MapPin, Trophy, Play, Trash2 } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { styles } from './FixtureManageCardStyles';
import { FixtureResponse } from '../../models/ApiResponses';
import { useFixtureManageCardVM } from './FixtureManageCardViewModel';

type Props = {
  fixture: FixtureResponse;
  roundName: string;
  isOrganizer: boolean;
  eventVenue: string;
  eventName?: string;
  onPress: () => void;
  onSchedule: () => void;
  onDelete: () => void;
};

const FixtureManageCard = ({
  fixture,
  roundName,
  isOrganizer,
  eventVenue,
  eventName,
  onPress,
  onSchedule,
  onDelete,
}: Props) => {
  const {
    isLive,
    isCompleted,
    isUpcoming,
    isBye,
    totalScoreA,
    totalScoreB,
    winnerName,
    displayDateTime,
    viewBtnLabel,
    showActions,
    showLiveWatch,
    showSchedule,
    showDelete,
    teams,
  } = useFixtureManageCardVM({ fixture, isOrganizer });

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.roundName}>{roundName}</Text>
          {eventName ? <Text style={styles.eventName}>{eventName}</Text> : null}
        </View>
        <View style={[
          styles.statusBadge,
          isLive && styles.statusLive,
          isUpcoming && styles.statusUpcoming,
          isCompleted && styles.statusCompleted,
        ]}>
          {isLive ? <View style={styles.liveDot} /> : null}
          <Text style={[
            styles.statusText,
            isLive && styles.statusTextLive,
            isUpcoming && styles.statusTextUpcoming,
            isCompleted && styles.statusTextCompleted,
          ]}>
            {isLive ? 'LIVE' : fixture.status}
          </Text>
        </View>
      </View>

      <View style={styles.matchContent}>
        {teams.map((item) => (
          <View key={item.index} style={styles.teamSection}>
            <View style={[styles.teamIcon, item.name === 'TBD' && styles.tbdIcon]}>
              <User
                size={20}
                color={item.name === 'TBD' ? colors.textSecondary : colors.appBackground}
              />
            </View>
            <Text
              style={[styles.teamName, item.name === 'TBD' && styles.tbdText]}
              numberOfLines={2}
            >
              {item.name}
            </Text>
            {!isBye && item.name !== 'TBD' && (isLive || isCompleted) ? (
              <Text style={[
                styles.score,
                item.index === 0 && totalScoreA > totalScoreB && styles.winnerScore,
                item.index === 1 && totalScoreB > totalScoreA && styles.winnerScore,
              ]}>
                {item.score}
              </Text>
            ) : null}
          </View>
        ))}
      </View>

      <View style={styles.infoRow}>
        <MapPin size={13} color={colors.textSecondary} />
        <Text style={styles.infoText}>{eventVenue}</Text>
      </View>

      {displayDateTime ? (
        <View style={styles.infoRow}>
          <Calendar size={13} color={colors.textSecondary} />
          <Text style={styles.infoText}>{displayDateTime}</Text>
        </View>
      ) : null}

      {winnerName ? (
        <View style={styles.winnerBanner}>
          <Trophy size={14} color={colors.participantBackgroud} />
          <Text style={styles.winnerText}>{'Winner: ' + winnerName}</Text>
        </View>
      ) : null}

      {showActions ? (
        <View style={styles.actionsRow}>
          {showSchedule ? (
            <Pressable
              style={styles.scheduleBtn}
              onPress={(e) => { e.stopPropagation?.(); onSchedule(); }}
            >
              <Calendar size={14} color={colors.primary} />
              <Text style={styles.scheduleBtnText}>Schedule</Text>
            </Pressable>
          ) : null}
          {showDelete ? (
            <Pressable
              style={styles.deleteBtn}
              onPress={(e) => { e.stopPropagation?.(); onDelete(); }}
            >
              <Trash2 size={14} color={colors.error} />
              <Text style={styles.deleteBtnText}>Delete</Text>
            </Pressable>
          ) : null}
          <Pressable style={styles.viewBtn} onPress={onPress}>
            {isUpcoming ? <Play size={14} color={colors.primaryText} /> : null}
            <Text style={styles.viewBtnText}>{viewBtnLabel}</Text>
          </Pressable>
        </View>
      ) : null}

      {showLiveWatch ? (
        <View style={{ marginTop: 8, alignItems: 'flex-end' }}>
          <Text style={{ color: colors.participantBackgroud, fontSize: 12, fontWeight: '600' }}>
            {'Tap to watch live →'}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
};

export default FixtureManageCard;