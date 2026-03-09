import React from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { styles } from './RoleNameTabsStyles';

const ROLE_NAME_TABS = [
  'ALL',
  'ADMIN',
  'OPS TEAM',
  'ORGANIZER',
  'PARTICIPANTS',
] as const;

export type RoleNameTabType = (typeof ROLE_NAME_TABS)[number];

type RoleNameTabsTypes = {
  activeTab: RoleNameTabType;
  onChange: (tab: RoleNameTabType) => void;
};

const RoleNameTabs = ({ activeTab, onChange }: RoleNameTabsTypes) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={ROLE_NAME_TABS}
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

export default RoleNameTabs;
