import apiClient from './apiClient';

export const getFocusSessions = () => apiClient('/health/focus-sessions', { method: 'GET' });
export const createFocusSession = (data) => apiClient('/health/focus-sessions', { method: 'POST', body: data });

export default {
  getFocusSessions,
  createFocusSession
};
