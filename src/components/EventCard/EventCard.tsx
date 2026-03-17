import { Text, TouchableOpacity, View } from 'react-native';
import { EventResponse } from '../../models/EventResponse';
import { styles } from './EventCardStyles';
import { colors } from '../../theme/colors';
import { Calendar, MapPin } from 'lucide-react-native';
import { useState } from 'react';
import { UserRoleType } from '../../models/User';

type EventCardProps = {
  event: EventResponse;
  role: UserRoleType;
  onPress: () => void;
};

const EventCard = ({ event, onPress }: EventCardProps) => {
  const [pressed, setPressed] = useState(false);

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={pressed && styles.pressed}
    >
      <View style={styles.container}>
        <View style={styles.status}>
          <Text style={styles.sportText}>{event.sportName}</Text>
          <Text style={[styles.statusText, styles[`status_${event.status.toUpperCase()}` as keyof typeof styles]]}>
            {event.status}
          </Text>
        </View>
        <View style={styles.left}>
          <View style={styles.info}>
            <Text style={styles.title}>{event.name}</Text>
            <View style={styles.details}>
              <Calendar color={colors.textSecondary} />
              <Text style={styles.detailsText}>{String(event.startDate)}</Text>
            </View>
            <View style={styles.details}>
              <MapPin color={colors.textSecondary} />
              <Text style={styles.detailsText}>{event.eventVenue}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default EventCard;