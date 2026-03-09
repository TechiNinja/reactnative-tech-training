import { Text, TouchableOpacity, View } from 'react-native';
import { User } from '../../models/User';
import { styles } from './UserCardStyles';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { useState } from 'react';
import { APP_STRINGS } from '../../constants/AppStrings';

type UserCardProps = {
  user: User;
  onPress: () => void;
};

const ROLE_LABELS: Record<User['role'], string> = {
  admin: 'Admin',
  organizer: 'Organizer',
  operations: 'Ops Team',
  participant: 'Participant',
};

const UserCard = ({ user, onPress }: UserCardProps) => {
  const [pressed, setPressed] = useState(false);

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={pressed && styles.pressed}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name}>{user.name}</Text>
            <View style={[styles.roleBadge, styles[`role_${user.role}`]]}>
              <Text style={[styles.roleText, styles[`roleText_${user.role}`]]}>
                {ROLE_LABELS[user.role]}
              </Text>
            </View>
          </View>
          <Text style={styles.email}>{user.email}</Text>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                user.isActive
                  ? styles.statusDotActive
                  : styles.statusDotInactive,
              ]}
            />
            <Text style={styles.statusText}>
              {user.isActive
                ? APP_STRINGS.eventScreen.active
                : APP_STRINGS.eventScreen.inactive}
            </Text>
          </View>
        </View>
        <View style={styles.arrowContainer}>
          <ChevronRight size={24} color={colors.textSecondary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default UserCard;
