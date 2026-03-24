import React from 'react';
import { View, Text } from 'react-native';
import { Calendar, MapPin, Users } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { styles } from './UpcomingMatchesCardStyles';
import { APP_STRINGS } from '../../constants/AppStrings';
import { UpcomingMatchStatus } from '../../models/Event';

type UpcomingMatchesCardProps = {
  sport: string;
  title: string;
  date: string;
  location: string;
  currentTeams: number;
  maxTeams: number;
  status: UpcomingMatchStatus;
  sportIcon: React.ReactNode;
};

const UpcomingMatchesCard = ({
  sport,
  title,
  date,
  location,
  currentTeams,
  maxTeams,
  status,
  sportIcon,
}: UpcomingMatchesCardProps) => {
  const progress = (currentTeams / maxTeams) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sportText}>{sport}</Text>

        <View
          style={[
            styles.statusBadge,
            status === UpcomingMatchStatus.UPCOMING
              ? styles.liveBadge
              : styles.registrationBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              status === UpcomingMatchStatus.UPCOMING
                ? styles.liveText
                : styles.registrationText,
            ]}
          >
            {status === UpcomingMatchStatus.UPCOMING
              ? APP_STRINGS.eventScreen.upcoming
              : APP_STRINGS.eventScreen.registrationOpen}
          </Text>
        </View>
      </View>

      <View style={styles.iconContainer}>{sportIcon}</View>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.metaRow}>
        <Calendar size={18} color={colors.textSecondary} />
        <Text style={styles.metaText}>{date}</Text>
      </View>

      <View style={styles.metaRow}>
        <MapPin size={18} color={colors.textSecondary} />
        <Text style={styles.metaText}>{location}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <View style={styles.teamInfo}>
          <Users size={18} color={colors.primary} />
          <Text style={styles.teamText}>
            {currentTeams}
            <Text style={styles.teamMuted}> / {maxTeams} teams</Text>
          </Text>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>
    </View>
  );
};

export default UpcomingMatchesCard;
