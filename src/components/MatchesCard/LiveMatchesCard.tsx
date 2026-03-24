import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './LiveMatchesCardStyles';
import { APP_STRINGS } from '../../constants/AppStrings';
import { MatchStatus } from '../../models/Event';

type LiveMatchesCardProps = {
  gameName: string;
  firstTeam: string;
  secondTeam: string;
  firstTeamPoints: number;
  secondTeamPoints: number;
  status?: string;
  firstTeamLogo: React.ReactNode;
  secondTeamLogo: React.ReactNode;
  venue: string;
  statusIcon: React.ReactNode;
  venueIcon: React.ReactNode;
};

const LiveMatchesCard = ({
  gameName,
  firstTeam,
  secondTeam,
  firstTeamPoints,
  secondTeamPoints,
  status,
  firstTeamLogo,
  secondTeamLogo,
  venue,
  statusIcon,
  venueIcon,
}: LiveMatchesCardProps) => {
  const isFirstTeamLeading = firstTeamPoints > secondTeamPoints;
  const isSecondTeamLeading = secondTeamPoints > firstTeamPoints;

  const isLive = status === MatchStatus.LIVE;
  const isUpcoming = status === MatchStatus.UPCOMING;
  const isCompleted = status === MatchStatus.COMPLETED;

  return (
    <View style={styles.container}>
      <View style={styles.detailContainer}>
        <Text style={styles.gameTitle}>{gameName}</Text>
        <Text
          style={[
            styles.gameStatus,
            isLive && styles.gameStatusLive,
            isUpcoming && styles.gameStatusUpcoming,
            isCompleted && styles.gameStatusCompleted,
          ]}
        >
          {status}
        </Text>
      </View>

      <View style={styles.pointsContainer}>
        <View style={styles.teamContainer}>
          <View style={styles.logoContainer}>{firstTeamLogo}</View>
          <Text style={styles.teamName}>{firstTeam}</Text>
          <Text
            style={[
              styles.pointsStyle,
              isFirstTeamLeading && styles.leadingScore,
            ]}
          >
            {firstTeamPoints}
          </Text>
        </View>

        <View style={styles.teamContainer}>
          <Text style={styles.textStyle}>{APP_STRINGS.eventScreen.vs}</Text>
          {status === MatchStatus.LIVE ? (
            <Text style={styles.statusStyle}>{status}</Text>
          ) : (
            ''
          )}
        </View>

        <View style={styles.teamContainer}>
          <View style={styles.logoContainer}>{secondTeamLogo}</View>
          <Text style={styles.teamName}>{secondTeam}</Text>
          <Text
            style={[
              styles.pointsStyle,
              isSecondTeamLeading && styles.leadingScore,
            ]}
          >
            {secondTeamPoints}
          </Text>
        </View>
      </View>

      <View style={styles.footerContainer}>
        <View style={styles.footer}>
          {statusIcon}
          <Text style={styles.footerText}>{status}</Text>
        </View>
        <View style={styles.footer}>
          {venueIcon}
          <Text style={styles.footerText}>{venue}</Text>
        </View>
      </View>
    </View>
  );
};

export default LiveMatchesCard;
