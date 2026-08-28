import apiClient from './apiClient';

export const getHealthProfile = (todayStr) => {
  const query = todayStr ? `?today=${todayStr}` : '';
  return apiClient(`/health/profile${query}`, { method: 'GET' });
};

export const updateWaterIntake = (amount, todayStr) => apiClient('/health/water', {
  method: 'POST',
  body: { amount, today: todayStr }
});

export const updateWaterGoal = (goal, todayStr) => apiClient('/health/water/goal', {
  method: 'PUT',
  body: { goal, today: todayStr }
});

export const addWorkout = (workoutData) => apiClient('/health/workouts', {
  method: 'POST',
  body: workoutData
});

export const logSleep = (sleepData) => apiClient('/health/sleep', {
  method: 'POST',
  body: sleepData
});

export const logMeditation = (meditationData) => apiClient('/health/meditation', {
  method: 'POST',
  body: meditationData
});

export const toggleHabitToday = (id, todayStr) => apiClient(`/health/habits/${id}/toggle`, {
  method: 'PATCH',
  body: { today: todayStr }
});

export const addHabit = (habitData) => apiClient('/health/habits', {
  method: 'POST',
  body: habitData
});

export const toggleReminder = (key, todayStr) => apiClient('/health/reminders', {
  method: 'PATCH',
  body: { key, today: todayStr }
});

export default {
  getHealthProfile,
  updateWaterIntake,
  updateWaterGoal,
  addWorkout,
  logSleep,
  logMeditation,
  toggleHabitToday,
  addHabit,
  toggleReminder
};
