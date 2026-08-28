import apiClient from './apiClient';

export const getMigrationStatus = () => apiClient('/migration/status', { method: 'GET' });

export const importLegacyData = (data) => 
  apiClient('/migration/import', {
    method: 'POST',
    body: { data }
  });

export default {
  getMigrationStatus,
  importLegacyData
};
