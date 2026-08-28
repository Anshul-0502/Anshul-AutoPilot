import apiClient from './apiClient';

export const getAnalyticsSummary = (filter = 'Weekly') => 
  apiClient(`/analytics/summary?filter=${filter}`, { method: 'GET' });

export default {
  getAnalyticsSummary
};
