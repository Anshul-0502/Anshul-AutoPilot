import apiClient from './apiClient';

export const getProjects = () => apiClient('/projects', { method: 'GET' });
export const getProject = (id) => apiClient(`/projects/${id}`, { method: 'GET' });
export const createProject = (data) => apiClient('/projects', { method: 'POST', body: data });
export const updateProject = (id, data) => apiClient(`/projects/${id}`, { method: 'PUT', body: data });
export const deleteProject = (id) => apiClient(`/projects/${id}`, { method: 'DELETE' });

export default {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
};
