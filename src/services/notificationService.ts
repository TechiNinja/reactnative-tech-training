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
  userId?: number;
};

const toQueryString = ({ audience, userId }: NotificationFilter) => {
  const params = new URLSearchParams();

  params.append('audience', audience);

  if (userId !== undefined) {
    params.append('userId', String(userId));
  }

  return `?${params.toString()}`;
};

export const notificationService = {
  getAll(filter: NotificationFilter): Promise<NotificationItem[]> {
    return authFetch<NotificationItem[]>(
      `${API_ENDPOINTS.NOTIFICATIONS.BASE}${toQueryString(filter)}`,
    );
  },

  markAllAsRead(filter: NotificationFilter): Promise<void> {
    return authFetch<void>(
      `${API_ENDPOINTS.NOTIFICATIONS.MARK_READ}${toQueryString(filter)}`,
      {
        method: 'PUT',
      },
    );
  },
};