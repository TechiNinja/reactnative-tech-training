import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './CategoryCardStyles';
import { useCategoryCardViewModel } from './CategoryCardViewModel';
import { colors } from '../../theme/colors';
import { APP_STRINGS } from '../../constants/AppStrings';
import { FormatType, GenderType } from '../../models/Event';

type CategoryCardProps = {
  title: string;
  format: FormatType;
  gender: GenderType;
  participantCount: number;
  totalParticipants: number;
  teamCount?: number;
  isAbandoned?: boolean;
  onPress: () => void;
};

const CategoryCard = ({
  title,
  format,
  gender,
  participantCount,
  totalParticipants,
  teamCount,
  isAbandoned = false,
  onPress,
}: CategoryCardProps) => {
  const { iconColor, Icon, showTeams } = useCategoryCardViewModel({
    format,
    gender,
    teamCount,
  });

  const progress =
    totalParticipants > 0 ? participantCount / totalParticipants : 0;
  const progressWidth = `${Math.min(progress * 100, 100)}%` as `${number}%`;
  const slotsFull = participantCount >= totalParticipants;

  const getProgressColor = () => {
    if (slotsFull) return colors.error;
    if (progress >= 0.8) return colors.participantBackgroud;
    return colors.matchesIconBackgound;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View
        style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}
      >
        <Icon size={24} color={iconColor} />
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          {isAbandoned && (
            <Text style={styles.abandonedBadge}>
              {APP_STRINGS.eventScreen.abandoned}
            </Text>
          )}
          {slotsFull && !isAbandoned && (
            <Text style={styles.slotsBadge}>
              {APP_STRINGS.eventScreen.registrationClosed}
            </Text>
          )}
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statsText}>
            {participantCount} / {totalParticipants} Participants
          </Text>
          {showTeams && (
            <Text style={styles.statsText}> • {teamCount} Teams</Text>
          )}
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: progressWidth, backgroundColor: getProgressColor() },
            ]}
          />
        </View>
      </View>

      <View style={styles.arrow}>
        <Text style={styles.arrowText}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CategoryCard;
