import {
  Pressable,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import React from 'react';
import ScreenWrapper from '../../components/ScreenWrapper/ScreenWrapper';
import { ArrowLeft } from 'lucide-react-native';
import { styles } from './NotificationScreenStyle';
import { colors } from '../../theme/colors';
import { useNotificationViewModel } from '../../viewModels/NotificationScreenViewModel';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { APP_STRINGS } from '../../constants/AppStrings';

type Props = NativeStackScreenProps<RootStackParamList, 'Notification'>;

const NotificationScreen = ({ navigation, route }: Props) => {
  const audience = route.params?.audience ?? 'Ops';

  const { handleBack, refresh, loading, notifications, error } =
    useNotificationViewModel(navigation, audience);

  return (
    <ScreenWrapper scrollable={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.textPrimary} />
          </Pressable>

          <Text style={styles.headerTitle}>
            {APP_STRINGS.NotificationScreen.Notification}
          </Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refresh} />
          }
        >
          {loading && notifications.length === 0 ? (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <ActivityIndicator />
              <Text style={{ marginTop: 10, color: colors.textSecondary }}>
                {APP_STRINGS.NotificationScreen.loadingNotification}
              </Text>
            </View>
          ) : null}

          {!loading && !!error ? (
            <View style={{ paddingVertical: 16, paddingHorizontal: 16 }}>
              <Text style={{ color: 'tomato', marginBottom: 10 }}>{error}</Text>

              <Pressable
                onPress={refresh}
                style={{
                  paddingVertical: 12,
                  borderRadius: 10,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>
                  Retry
                </Text>
              </Pressable>
            </View>
          ) : null}

          {!loading && !error && notifications.length === 0 ? (
            <View style={{ paddingVertical: 24, alignItems: 'center' }}>
              <Text style={{ color: colors.textSecondary }}>
                {APP_STRINGS.NotificationScreen.noNotification}
              </Text>
            </View>
          ) : null}

          <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
            {notifications.map(n => {
              const isNew = !n.isRead;

              return (
                <View
                  key={n.id}
                  style={{
                    padding: 14,
                    borderRadius: 12,
                    marginTop: 12,
                    borderWidth: 1.5,
                    borderColor: isNew ? 'red' : colors.border,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.textPrimary,
                        fontWeight: '600',
                        flex: 1,
                      }}
                    >
                      {n.message}
                    </Text>

                    {isNew ? (
                      <View
                        style={{
                          backgroundColor: colors.primary,
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                          borderRadius: 999,
                        }}
                      >
                        <Text
                          style={{
                            color: 'white',
                            fontSize: 11,
                            fontWeight: '700',
                          }}
                        >
                          NEW
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  <View
                    style={{
                      marginTop: 8,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                      {APP_STRINGS.NotificationScreen.request} {n.eventRequestId}
                    </Text>

                    <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                      {formatDateTime(n.createdAt)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default NotificationScreen;

const formatDateTime = (iso: string) => {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
};