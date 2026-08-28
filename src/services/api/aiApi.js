import apiClient from './apiClient';

export const getChatHistory = () => apiClient('/ai/chat', { method: 'GET' });

export const saveChatMessage = (sender, text, timestamp) => 
  apiClient('/ai/chat', {
    method: 'POST',
    body: { sender, text, timestamp }
  });

export const clearChatHistory = () => apiClient('/ai/chat', { method: 'DELETE' });

export default {
  getChatHistory,
  saveChatMessage,
  clearChatHistory
};
