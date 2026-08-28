import apiClient from './apiClient';

export const getNotifications = () => apiClient('/notifications', { method: 'GET' });
export const createNotification = (data) => apiClient('/notifications', { method: 'POST', body: data });
export const markAsRead = (id) => apiClient(`/notifications/${id}/read`, { method: 'PATCH' });
export const markAllAsRead = () => apiClient('/notifications/read-all', { method: 'PATCH' });
export const deleteNotification = (id) => apiClient(`/notifications/${id}`, { method: 'DELETE' });
export const clearAllNotifications = () => apiClient('/notifications/clear-all', { method: 'DELETE' });

export const getAlertRegisters = () => apiClient('/notifications/alerts', { method: 'GET' });
export const createAlertRegister = (data) => apiClient('/notifications/alerts', { method: 'POST', body: data });
export const toggleAlertRegister = (id, data) => apiClient(`/notifications/alerts/${id}`, { method: 'PATCH', body: data });
export const deleteAlertRegister = (id) => apiClient(`/notifications/alerts/${id}`, { method: 'DELETE' });

export const getQueuedNotifications = () => apiClient('/notifications/queue', { method: 'GET' });
export const createQueuedNotification = (data) => apiClient('/notifications/queue', { method: 'POST', body: data });
export const deleteQueuedNotification = (id) => apiClient(`/notifications/queue/${id}`, { method: 'DELETE' });
export const processQueue = () => apiClient('/notifications/queue/process', { method: 'POST' });

export default {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  getAlertRegisters,
  createAlertRegister,
  toggleAlertRegister,
  deleteAlertRegister,
  getQueuedNotifications,
  createQueuedNotification,
  deleteQueuedNotification,
  processQueue
};
