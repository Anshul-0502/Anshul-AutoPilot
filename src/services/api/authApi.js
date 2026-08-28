import apiClient from './apiClient';

/**
 * Register a new user account.
 * @param {string} name - User's full name
 * @param {string} email - Normalized email address
 * @param {string} password - Raw password (min 6 characters)
 * @returns {Promise<Object>} Response containing success status, user data
 */
export const register = async (name, email, password) => {
  return await apiClient('/auth/register', {
    method: 'POST',
    body: { name, email, password }
  });
};

/**
 * Login user and start session.
 * @param {string} email - User email address
 * @param {string} password - User password
 * @returns {Promise<Object>} Response containing success status, user data
 */
export const login = async (email, password) => {
  return await apiClient('/auth/login', {
    method: 'POST',
    body: { email, password }
  });
};

/**
 * Terminate user session and clear cookies.
 * @returns {Promise<Object>} Success response
 */
export const logout = async () => {
  return await apiClient('/auth/logout', {
    method: 'POST'
  });
};

/**
 * Fetch current user profile.
 * @returns {Promise<Object>} Current user data
 */
export const getCurrentUser = async () => {
  return await apiClient('/auth/me', {
    method: 'GET'
  });
};

export default {
  register,
  login,
  logout,
  getCurrentUser
};
