import apiClient from './apiClient';

// --- SUBJECTS ---
export const getSubjects = () => apiClient('/study/subjects', { method: 'GET' });
export const createSubject = (data) => apiClient('/study/subjects', { method: 'POST', body: data });
export const updateSubject = (id, data) => apiClient(`/study/subjects/${id}`, { method: 'PUT', body: data });
export const deleteSubject = (id) => apiClient(`/study/subjects/${id}`, { method: 'DELETE' });

// --- NOTES ---
export const getNotes = () => apiClient('/study/notes', { method: 'GET' });
export const createNote = (data) => apiClient('/study/notes', { method: 'POST', body: data });
export const updateNote = (id, data) => apiClient(`/study/notes/${id}`, { method: 'PUT', body: data });
export const deleteNote = (id) => apiClient(`/study/notes/${id}`, { method: 'DELETE' });

// --- PDFs ---
export const getPdfs = () => apiClient('/study/pdfs', { method: 'GET' });
export const createPdf = (data) => apiClient('/study/pdfs', { method: 'POST', body: data });
export const updatePdf = (id, data) => apiClient(`/study/pdfs/${id}`, { method: 'PUT', body: data });

// --- RESOURCES ---
export const getResources = () => apiClient('/study/resources', { method: 'GET' });
export const createResource = (data) => apiClient('/study/resources', { method: 'POST', body: data });
export const updateResource = (id, data) => apiClient(`/study/resources/${id}`, { method: 'PUT', body: data });
export const deleteResource = (id) => apiClient(`/study/resources/${id}`, { method: 'DELETE' });

// --- COURSES ---
export const getCourses = () => apiClient('/study/courses', { method: 'GET' });
export const createCourse = (data) => apiClient('/study/courses', { method: 'POST', body: data });
export const updateCourse = (id, data) => apiClient(`/study/courses/${id}`, { method: 'PUT', body: data });
export const deleteCourse = (id) => apiClient(`/study/courses/${id}`, { method: 'DELETE' });

// --- REVISIONS ---
export const getRevisions = () => apiClient('/study/revisions', { method: 'GET' });
export const createRevision = (data) => apiClient('/study/revisions', { method: 'POST', body: data });
export const updateRevision = (id, data) => apiClient(`/study/revisions/${id}`, { method: 'PUT', body: data });
export const deleteRevision = (id) => apiClient(`/study/revisions/${id}`, { method: 'DELETE' });

// --- SESSIONS ---
export const getSessions = () => apiClient('/study/sessions', { method: 'GET' });
export const createSession = (data) => apiClient('/study/sessions', { method: 'POST', body: data });
export const getStudySummary = () => apiClient('/study/summary', { method: 'GET' });

export default {
  getSubjects, createSubject, updateSubject, deleteSubject,
  getNotes, createNote, updateNote, deleteNote,
  getPdfs, createPdf, updatePdf,
  getResources, createResource, updateResource, deleteResource,
  getCourses, createCourse, updateCourse, deleteCourse,
  getRevisions, createRevision, updateRevision, deleteRevision,
  getSessions, createSession, getStudySummary
};
