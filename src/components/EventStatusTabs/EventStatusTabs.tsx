import { View, Text, Pressable } from 'react-native';
import { styles } from './EventStatusTabsStyle';
import { EventStatusTab } from '../../models/Event';

const TABS: EventStatusTab[] = [
  EventStatusTab.ALL,
  EventStatusTab.UPCOMING,
  EventStatusTab.LIVE,
  EventStatusTab.COMPLETED,
];

const formatTabLabel = (tab: EventStatusTab): string => {
  if (tab === EventStatusTab.ALL) return 'All';
  return tab.charAt(0).toUpperCase() + tab.slice(1).toLowerCase();
};

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
              {formatTabLabel(tab)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default EventStatusTabs;