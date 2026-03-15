import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { fontsSize } from '../../theme/fonts';

export const styles = StyleSheet.create({
  backButton: {
    padding: 4,
  },

  container: {
    flex: 1,
  },


  header: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerRight: {
    width: 32,
  },
  headerTitle: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },

  loaderContainer: {
  paddingVertical: 20,
  alignItems: 'center',
},

loaderText: {
  marginTop: 10,
  color: colors.textSecondary,
},

errorContainer: {
  paddingVertical: 16,
  paddingHorizontal: 16,
},

errorText: {
  color: 'tomato',
  marginBottom: 10,
},

retryButton: {
  paddingVertical: 12,
  borderRadius: 10,
  alignItems: 'center',
  borderWidth: 1,
  borderColor: colors.border,
},

retryButtonText: {
  color: colors.textPrimary,
  fontWeight: '600',
},

emptyContainer: {
  paddingVertical: 24,
  alignItems: 'center',
},

emptyText: {
  color: colors.textSecondary,
},

notificationListContainer: {
  paddingHorizontal: 16,
  paddingBottom: 16,
},

notificationCard: {
  padding: 14,
  borderRadius: 12,
  marginTop: 12,
  borderWidth: 1.5,
  borderColor: colors.border,
},

unreadNotificationCard: {
  borderColor: 'red',
},

notificationTopRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 10,
},

notificationMessage: {
  color: colors.textPrimary,
  fontWeight: '600',
  flex: 1,
},

newBadge: {
  backgroundColor: colors.primary,
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 999,
},

newBadgeText: {
  color: colors.textPrimary,
  fontSize: 11,
  fontWeight: '700',
},

notificationBottomRow: {
  marginTop: 8,
  flexDirection: 'row',
  justifyContent: 'space-between',
},

notificationMetaText: {
  color: colors.textSecondary,
  fontSize: 12,
},
 

  


});
