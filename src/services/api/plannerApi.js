import apiClient from './apiClient';

/**
 * Fetch all planner events for the authenticated user.
 * @returns {Promise<Object>} Response containing success status, events array
 */
export const getEvents = async () => {
  return await apiClient('/planner', { method: 'GET' });
};

/**
 * Create a new planner event.
 * @param {Object} eventData - Fields of the event to create (title, startTime, endTime, category, duration, date)
 * @returns {Promise<Object>} Response containing success status, saved event data
 */
export const createEvent = async (eventData) => {
  return await apiClient('/planner', {
    method: 'POST',
    body: eventData
  });
};

/**
 * Update an existing planner event.
 * @param {string} id - Event ID to update
 * @param {Object} updates - Fields to update in the event
 * @returns {Promise<Object>} Response containing success status, updated event data
 */
export const updateEvent = async (id, updates) => {
  return await apiClient(`/planner/${id}`, {
    method: 'PUT',
    body: updates
  });
};

/**
 * Delete a planner event.
 * @param {string} id - Event ID to delete
 * @returns {Promise<Object>} Response containing success status, deleted event ID
 */
export const deleteEvent = async (id) => {
  return await apiClient(`/planner/${id}`, {
    method: 'DELETE'
  });
};

export default {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
};
