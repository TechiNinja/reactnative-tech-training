import AsyncStorage from '@react-native-async-storage/async-storage';

const OPS_LAST_SEEN_COUNT_KEY = 'ops_last_seen_notification_count';
const ADMIN_LAST_SEEN_COUNT_KEY = 'admin_last_seen_notification_count';

export const getOpsLastSeenCount = async (): Promise<number> => {
  try {
    const value = await AsyncStorage.getItem(OPS_LAST_SEEN_COUNT_KEY);
    return value ? Number(value) : 0;
  } catch {
    return 0;
  }
};

export const setOpsLastSeenCount = async (count: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(OPS_LAST_SEEN_COUNT_KEY, String(count));
  } catch {}
};

export const getAdminLastSeenCount = async (): Promise<number> => {
  try {
    const value = await AsyncStorage.getItem(ADMIN_LAST_SEEN_COUNT_KEY);
    return value ? Number(value) : 0;
  } catch {
    return 0;
  }
};

export const setAdminLastSeenCount = async (count: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(ADMIN_LAST_SEEN_COUNT_KEY, String(count));
  } catch {}
};