import React from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { styles } from './TeamStatusTabsStyles';

const SPORTS_TABS = [
  'ALL',
  'BADMINTON',
  'CARROM',
  'FOOSBALL',
  'POOL',
  'TABLE TENNIS',
] as const;

export type SportTabType = (typeof SPORTS_TABS)[number];

type SportsStatusTabProps = {
  activeTab: SportTabType;
  onChange: (tab: SportTabType) => void;
};

const TeamStatusTabs = ({ activeTab, onChange }: SportsStatusTabProps) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={SPORTS_TABS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        renderItem={({ item }) => {
          const isActive = activeTab === item;

          return (
            <Pressable
              onPress={() => onChange(item)}
              style={[styles.tab, isActive && styles.activeTab]}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {item}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
};

export default TeamStatusTabs;
