import React from 'react';
import {
  Pressable,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import ScreenWrapper from '../../components/ScreenWrapper/ScreenWrapper';
import { styles } from './NotificationScreenStyle';
import { colors } from '../../theme/colors';
import { useNotificationViewModel } from '../../viewModels/NotificationScreenViewModel';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { APP_STRINGS } from '../../constants/AppStrings';

type Props = NativeStackScreenProps<RootStackParamList, 'Notification'>;

const NotificationScreen = ({ navigation, route }: Props) => {
  const audience = route.params?.audience ?? 'Ops';

  const { handleBack, refresh, loading, notifications, error } =
    useNotificationViewModel(navigation, audience);

  const showInitialLoader = loading && notifications.length === 0;
  const showError = !loading && !!error;
  const showEmptyState = !loading && !error && notifications.length === 0;
  const showNotifications = notifications.length > 0;

  return (
    <ScreenWrapper scrollable={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.textPrimary} />
          </Pressable>

          <Text style={styles.headerTitle}>
            {APP_STRINGS.NotificationScreen.notification}
          </Text>

          <View style={styles.headerRight} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refresh} />
          }
        >
          {showInitialLoader && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator />
              <Text style={styles.loaderText}>
                {APP_STRINGS.NotificationScreen.loadingNotification}
              </Text>
            </View>
          )}

          {showError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>

              <Pressable onPress={refresh} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>
                  {APP_STRINGS.NotificationScreen.retry}
                </Text>
              </Pressable>
            </View>
          )}

          {showEmptyState && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {APP_STRINGS.NotificationScreen.noNotification}
              </Text>
            </View>
          )}

          {showNotifications && (
            <View style={styles.notificationListContainer}>
              {notifications.map(notification => {
                const isUnread = !notification.isRead;

                return (
                  <View
                    key={notification.id}
                    style={[
                      styles.notificationCard,
                      isUnread && styles.unreadNotificationCard,
                    ]}
                  >
                    <View style={styles.notificationTopRow}>
                      <Text style={styles.notificationMessage}>
                        {notification.message}
                      </Text>

                      {isUnread && (
                        <View style={styles.newBadge}>
                          <Text style={styles.newBadgeText}>
                            {APP_STRINGS.NotificationScreen.new}
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.notificationBottomRow}>
                      <Text style={styles.notificationMetaText}>
                        {APP_STRINGS.NotificationScreen.request}{' '}
                        {notification.eventRequestId}
                      </Text>

                      <Text style={styles.notificationMetaText}>
                        {notification.createdAt}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default NotificationScreen;