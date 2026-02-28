import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../EventCard/EventCardStyles'; 
import { colors } from '../../theme/colors';
import { Calendar, MapPin } from 'lucide-react-native';
import { useState } from 'react';
import { EventRequestResponse } from '../../models/EventRequest';
import { RoleType } from '../../constants/Roles';

type EventRequestCardProps = {
  request: EventRequestResponse;
  role: RoleType;
  onPress: () => void;
};

const EventRequestCard = ({ request, onPress }: EventRequestCardProps) => {
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
         
          <Text style={styles.sportText}>{request.sportsName}</Text>

          <Text style={styles.statusText}>{request.status}</Text>
        </View>

        <View style={styles.left}>
          <View style={styles.info}>
        
            <Text style={styles.title}>{request.eventName}</Text>

            <View style={styles.details}>
              <Calendar color={colors.textSecondary} />
              <Text style={styles.detailsText}>
                {request.startDate} - {request.endDate}
              </Text>
            </View>

            <View style={styles.details}>
              <MapPin color={colors.textSecondary} />
              <Text style={styles.detailsText}>{request.requestedVenue}</Text>
            </View>

          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default EventRequestCard;