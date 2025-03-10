import { apiClient } from './client';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  related_to?: string;
  related_type?: string;
  created_at: string;
}

export interface NotificationPreference {
  id: string;
  user_id: string;
  type: string;
  email_enabled: boolean;
  push_enabled: boolean;
  in_app_enabled: boolean;
}

export const getNotifications = async (limit: number = 10): Promise<Notification[]> => {
  const response = await apiClient.get('/notifications', { params: { limit } });
  return response.data;
};

export const getUnreadNotificationsCount = async (): Promise<number> => {
  const response = await apiClient.get('/notifications/unread/count');
  return response.data.count;
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  await apiClient.put(`/notifications/${id}/read`);
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await apiClient.put('/notifications/read-all');
};

export const deleteNotification = async (id: string): Promise<void> => {
  await apiClient.delete(`/notifications/${id}`);
};

export const getNotificationPreferences = async (): Promise<NotificationPreference[]> => {
  const response = await apiClient.get('/notification-preferences');
  return response.data;
};

export const updateNotificationPreference = async (
  type: string, 
  data: { email_enabled?: boolean; push_enabled?: boolean; in_app_enabled?: boolean }
): Promise<NotificationPreference> => {
  const response = await apiClient.put(`/notification-preferences/${type}`, data);
  return response.data;
}; 