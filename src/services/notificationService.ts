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

type NotificationFilter = {
  audience: NotificationAudience;
  isRead?: boolean;
};

const toQueryString = ({ audience, isRead }: NotificationFilter) => {
  const params = new URLSearchParams();

  params.append('audience', audience);

  if (isRead !== undefined) {
    params.append('isRead', String(isRead));
  }

  return `?${params.toString()}`;
};

export const notificationService = {
  getAll(filter: NotificationFilter): Promise<NotificationItem[]> {
    return authFetch<NotificationItem[]>(
      `${API_ENDPOINTS.NOTIFICATIONS.BASE}${toQueryString(filter)}`,
    );
  },

  getUnreadCount(audience: NotificationAudience): Promise<number> {
    return authFetch<number>(
      `${API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT}?audience=${audience}`,
    );
  },

  markAllAsRead(audience: NotificationAudience): Promise<void> {
    return authFetch<void>(
      `${API_ENDPOINTS.NOTIFICATIONS.MARK_READ}?audience=${audience}`,
      {
        method: 'PUT',
      },
    );
  },
};