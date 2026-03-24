import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { User, Calendar, MapPin, Trophy, Play, Eye } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { styles } from './FixtureManageCardStyles';
import { FixtureResponse } from '../../models/ApiResponses';
import { useFixtureManageCardViewModel } from './FixtureManageCardViewModel';
import { APP_STRINGS } from '../../constants/appStrings';

type FixtureManageCardProps = {
  fixture: FixtureResponse;
  roundName: string;
  isOrganizer: boolean;
  eventVenue: string;
  eventName?: string;
  onPress: () => void;
};

const TBD = APP_STRINGS.fixtureScreen.tbd;

const FixtureManageCard = ({
  fixture,
  roundName,
  isOrganizer,
  eventVenue,
  eventName,
  onPress,
}: FixtureManageCardProps) => {
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
    participantBtnLabel,
    showActions,
    showLiveWatch,
    showViewResult,
    teams,
  } = useFixtureManageCardViewModel({ fixture, isOrganizer });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.roundName}>{roundName}</Text>
          {eventName ? <Text style={styles.eventName}>{eventName}</Text> : null}
        </View>
        <View style={[
          styles.statusBadge,
          isLive && styles.statusLive,
          isUpcoming && styles.statusUpcoming,
          isCompleted && styles.statusCompleted,
        ]}>
          <Text style={[
            styles.statusText,
            isLive && styles.statusTextLive,
            isUpcoming && styles.statusTextUpcoming,
            isCompleted && styles.statusTextCompleted,
          ]}>
            {isLive ? APP_STRINGS.eventScreen.live.toUpperCase() : fixture.status}
          </Text>
        </View>
      </View>

      <View style={styles.matchContent}>
        {teams.map((item) => (
          <View key={item.index} style={styles.teamSection}>
            <View style={[styles.teamIcon, item.name === TBD && styles.tbdIcon]}>
              <User
                size={20}
                color={item.name === TBD ? colors.textSecondary : colors.appBackground}
              />
            </View>
            <Text
              style={[styles.teamName, item.name === TBD && styles.tbdText]}
              numberOfLines={2}
            >
              {item.name}
            </Text>
            {!isBye && item.name !== TBD && (isLive || isCompleted) ? (
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
          <Text style={styles.winnerText}>{APP_STRINGS.matchScreen.winner(winnerName)}</Text>
        </View>
      ) : null}

      {showActions ? (
        <View style={styles.actionsRow}>
          <Pressable style={styles.viewBtn} onPress={onPress}>
            {isUpcoming ? <Play size={14} color={colors.primaryText} /> : null}
            <Text style={styles.viewBtnText}>{viewBtnLabel}</Text>
          </Pressable>
        </View>
      ) : null}

      {showLiveWatch || showViewResult ? (
        <View style={styles.actionsRow}>
          <Pressable style={styles.participantViewBtn} onPress={onPress}>
            <Eye size={14} color={colors.primary} />
            <Text style={styles.participantViewBtnText}>{participantBtnLabel}</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
};

export default FixtureManageCard;