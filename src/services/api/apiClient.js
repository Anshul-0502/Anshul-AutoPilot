const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

/**
 * Standard API Request wrapper.
 * @param {string} endpoint - API path (e.g., '/health' or '/tasks')
 * @param {Object} options - Fetch options (method, headers, body)
 * @returns {Promise<Object>} JSON response
 */
export const apiClient = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config = {
    credentials: 'include',
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`[API Client Error] Request to ${endpoint} failed:`, error.message);
    throw error;
  }
};

export default apiClient;
