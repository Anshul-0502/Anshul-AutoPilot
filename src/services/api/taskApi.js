import apiClient from './apiClient';

/**
 * Fetch all tasks owned by the authenticated user.
 * @returns {Promise<Object>} Response containing success status, tasks array
 */
export const getTasks = async () => {
  return await apiClient('/tasks', { method: 'GET' });
};

/**
 * Create a new task.
 * @param {Object} taskData - Fields of the task to create (title, description, priority, category, deadline, subtasks)
 * @returns {Promise<Object>} Response containing success status, saved task data
 */
export const createTask = async (taskData) => {
  return await apiClient('/tasks', {
    method: 'POST',
    body: taskData
  });
};

/**
 * Update an existing task.
 * @param {string} id - Task ID to update
 * @param {Object} updates - Fields to update in the task
 * @returns {Promise<Object>} Response containing success status, updated task data
 */
export const updateTask = async (id, updates) => {
  return await apiClient(`/tasks/${id}`, {
    method: 'PUT',
    body: updates
  });
};

/**
 * Delete a task.
 * @param {string} id - Task ID to delete
 * @returns {Promise<Object>} Response containing success status, deleted task ID
 */
export const deleteTask = async (id) => {
  return await apiClient(`/tasks/${id}`, {
    method: 'DELETE'
  });
};

/**
 * Toggle the completion status of a task.
 * @param {string} id - Task ID to toggle
 * @returns {Promise<Object>} Response containing success status, updated task data
 */
export const toggleTaskComplete = async (id) => {
  return await apiClient(`/tasks/${id}/complete`, {
    method: 'PATCH'
  });
};

export default {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskComplete
};
