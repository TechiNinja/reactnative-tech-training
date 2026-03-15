import { API_ENDPOINTS } from '../config/api';
import { authFetch } from '../utils/authFetch';

export type NotificationAudience = 'Ops' | 'Admin';

export type NotificationItem = {
  id: number;
  userId?: number | null;
  audience?: number | string;
  eventRequestId: number;
  message: string;
  type: number | string;
  createdAt: string;
  isRead: boolean;
};

const toQueryString = (audience: NotificationAudience) => {
  const params = new URLSearchParams();
  params.append('audience', audience);
  return `?${params.toString()}`;
};

export const notificationService = {
  getAll(audience: NotificationAudience): Promise<NotificationItem[]> {
    return authFetch<NotificationItem[]>(
      `${API_ENDPOINTS.NOTIFICATIONS.BASE}${toQueryString(audience)}`,
    );
  },

  markAllAsRead(audience: NotificationAudience): Promise<void> {
    return authFetch<void>(
      `${API_ENDPOINTS.NOTIFICATIONS.MARK_READ}${toQueryString(audience)}`,
      {
        method: 'PUT',
      },
    );
  },
};