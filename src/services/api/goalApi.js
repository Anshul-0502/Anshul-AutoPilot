import apiClient from './apiClient';

export const getGoals = () => apiClient('/goals', { method: 'GET' });

export const getGoalSummary = () => apiClient('/goals/summary', { method: 'GET' });

export const createGoal = (goalData) => apiClient('/goals', {
  method: 'POST',
  body: goalData
});

export const updateGoal = (id, goalData) => apiClient(`/goals/${id}`, {
  method: 'PUT',
  body: goalData
});

export const updateManualProgress = (id, currentValue) => apiClient(`/goals/${id}/progress`, {
  method: 'PATCH',
  body: { currentValue }
});

export const deleteGoal = (id) => apiClient(`/goals/${id}`, {
  method: 'DELETE'
});

export default {
  getGoals,
  getGoalSummary,
  createGoal,
  updateGoal,
  updateManualProgress,
  deleteGoal
};
