import apiClient from './apiClient';

/**
 * Fetch user profile from backend.
 * @returns {Promise<Object>} User Profile data
 */
export const getProfile = async () => {
  return await apiClient('/user/profile', { method: 'GET' });
};

/**
 * Update user profile details.
 * @param {Object} data - Profile fields to update (fullName, bio, college, skills, etc.)
 * @returns {Promise<Object>} Updated profile data
 */
export const updateProfile = async (data) => {
  return await apiClient('/user/profile', {
    method: 'PUT',
    body: data
  });
};

/**
 * Fetch application preferences.
 * @returns {Promise<Object>} Preferences data
 */
export const getPreferences = async () => {
  return await apiClient('/user/preferences', { method: 'GET' });
};

/**
 * Update user preferences settings.
 * @param {Object} data - Preferences categories to update (appearance, dashboard, etc.)
 * @returns {Promise<Object>} Updated preferences data
 */
export const updatePreferences = async (data) => {
  return await apiClient('/user/preferences', {
    method: 'PUT',
    body: data
  });
};

export default {
  getProfile,
  updateProfile,
  getPreferences,
  updatePreferences
};
