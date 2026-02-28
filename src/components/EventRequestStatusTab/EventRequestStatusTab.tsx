import { View, Text, Pressable } from 'react-native';
import { styles } from './EventRequestStatusTabStyle';
import { RequestStatus } from '../../models/EventRequest';

const TABS: RequestStatus[] = [
  RequestStatus.PENDING,
  RequestStatus.APPROVED,
  RequestStatus.REJECTED,
  RequestStatus.WITHDRAW,
];

type RequestStatusTabProps = {
  activeTab: RequestStatus;
  onChange: (tab: RequestStatus) => void;
};

const EventRequestStatusTabs = ({ activeTab, onChange }: RequestStatusTabProps) => {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab;

        return (
          <Pressable
            key={tab}
            onPress={() => onChange(tab)}
            style={[styles.tab, isActive && styles.activeTab]}
          >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {tab}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default EventRequestStatusTabs;