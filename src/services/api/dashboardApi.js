import apiClient from './apiClient';

export const getDashboardSummary = () => apiClient('/dashboard/summary', { method: 'GET' });

export default {
  getDashboardSummary
};
