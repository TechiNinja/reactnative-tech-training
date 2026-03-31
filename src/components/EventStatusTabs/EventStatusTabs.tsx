import { View, Text, Pressable } from 'react-native';
import { styles } from './EventStatusTabsStyle';
import { EventStatusTab } from '../../models/Event';

const TABS: EventStatusTab[] = [
  EventStatusTab.ALL,
  EventStatusTab.LIVE,
  EventStatusTab.UPCOMING,
  EventStatusTab.OPEN,
];

type EventStatusTabProps = {
  activeTab: EventStatusTab;
  onChange: (tab: EventStatusTab) => void;
};

const EventStatusTabs = ({ activeTab, onChange }: EventStatusTabProps) => {
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

export default EventStatusTabs;
