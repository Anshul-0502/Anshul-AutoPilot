import apiClient from './apiClient';

// --- LANGUAGES ---
export const getLanguages = () => apiClient('/coding/languages', { method: 'GET' });
export const createLanguage = (data) => apiClient('/coding/languages', { method: 'POST', body: data });
export const updateLanguage = (id, data) => apiClient(`/coding/languages/${id}`, { method: 'PUT', body: data });
export const deleteLanguage = (id) => apiClient(`/coding/languages/${id}`, { method: 'DELETE' });

// --- PROBLEMS ---
export const getProblems = () => apiClient('/coding/problems', { method: 'GET' });
export const createProblem = (data) => apiClient('/coding/problems', { method: 'POST', body: data });
export const updateProblem = (id, data) => apiClient(`/coding/problems/${id}`, { method: 'PUT', body: data });
export const deleteProblem = (id) => apiClient(`/coding/problems/${id}`, { method: 'DELETE' });

// --- SNIPPETS ---
export const getSnippets = () => apiClient('/coding/snippets', { method: 'GET' });
export const createSnippet = (data) => apiClient('/coding/snippets', { method: 'POST', body: data });
export const updateSnippet = (id, data) => apiClient(`/coding/snippets/${id}`, { method: 'PUT', body: data });
export const deleteSnippet = (id) => apiClient(`/coding/snippets/${id}`, { method: 'DELETE' });

// --- NOTES ---
export const getNotes = () => apiClient('/coding/notes', { method: 'GET' });
export const createNote = (data) => apiClient('/coding/notes', { method: 'POST', body: data });
export const updateNote = (id, data) => apiClient(`/coding/notes/${id}`, { method: 'PUT', body: data });
export const deleteNote = (id) => apiClient(`/coding/notes/${id}`, { method: 'DELETE' });

// --- GOALS ---
export const getGoals = () => apiClient('/coding/goals', { method: 'GET' });
export const createGoal = (data) => apiClient('/coding/goals', { method: 'POST', body: data });
export const updateGoal = (id, data) => apiClient(`/coding/goals/${id}`, { method: 'PUT', body: data });
export const deleteGoal = (id) => apiClient(`/coding/goals/${id}`, { method: 'DELETE' });

// --- RESOURCES ---
export const getResources = () => apiClient('/coding/resources', { method: 'GET' });
export const createResource = (data) => apiClient('/coding/resources', { method: 'POST', body: data });
export const deleteResource = (id) => apiClient(`/coding/resources/${id}`, { method: 'DELETE' });

// --- INTERVIEW TOPICS ---
export const getInterviewTopics = () => apiClient('/coding/interview', { method: 'GET' });
export const createInterviewTopic = (data) => apiClient('/coding/interview', { method: 'POST', body: data });
export const updateInterviewTopic = (id, data) => apiClient(`/coding/interview/${id}`, { method: 'PUT', body: data });
export const deleteInterviewTopic = (id) => apiClient(`/coding/interview/${id}`, { method: 'DELETE' });

// --- SESSIONS ---
export const getSessions = () => apiClient('/coding/sessions', { method: 'GET' });
export const createSession = (data) => apiClient('/coding/sessions', { method: 'POST', body: data });

// --- CODING SUMMARY ---
export const getCodingSummary = () => apiClient('/coding/summary', { method: 'GET' });

export default {
  getLanguages, createLanguage, updateLanguage, deleteLanguage,
  getProblems, createProblem, updateProblem, deleteProblem,
  getSnippets, createSnippet, updateSnippet, deleteSnippet,
  getNotes, createNote, updateNote, deleteNote,
  getGoals, createGoal, updateGoal, deleteGoal,
  getResources, createResource, deleteResource,
  getInterviewTopics, createInterviewTopic, updateInterviewTopic, deleteInterviewTopic,
  getSessions, createSession, getCodingSummary
};
