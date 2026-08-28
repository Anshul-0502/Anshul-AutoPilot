import apiClient from './apiClient';

export const getSkillProfile = (todayStr) => {
  const query = todayStr ? `?today=${todayStr}` : '';
  return apiClient(`/skills/profile${query}`, { method: 'GET' });
};

export const completeChallenge = (type, todayStr) => apiClient('/skills/challenges/complete', {
  method: 'POST',
  body: { type, today: todayStr }
});

export const recordActivity = (data) => apiClient('/skills/activities', {
  method: 'POST',
  body: data
});

export const completeMissionNode = (pathKey, nodeKey) => apiClient('/skills/missions/complete', {
  method: 'POST',
  body: { pathKey, nodeKey }
});

export const claimAchievement = (id) => apiClient(`/skills/achievements/${id}/claim`, {
  method: 'POST'
});

export default {
  getSkillProfile,
  completeChallenge,
  recordActivity,
  completeMissionNode,
  claimAchievement
};
