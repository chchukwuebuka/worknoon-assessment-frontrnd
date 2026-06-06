import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Legacy single-shot support
export const submitSupportRequest = async (customerId, message) => {
  const response = await api.post('support/', {
    customer_id: customerId,
    message: message,
  });
  return response.data;
};

export const getRequestHistory = async (customerId) => {
  const response = await api.get(`support/history/?customer_id=${customerId}`);
  return response.data;
};

// Conversational chat API
export const startConversation = async (customerId, message) => {
  const response = await api.post('support/conversations/', {
    customer_id: customerId,
    message: message,
  });
  return response.data;
};

export const sendMessage = async (conversationId, message) => {
  const response = await api.post(`support/conversations/${conversationId}/messages/`, {
    message: message,
  });
  return response.data;
};

export const getConversation = async (conversationId) => {
  const response = await api.get(`support/conversations/${conversationId}/messages/`);
  return response.data;
};

export const getConversationList = async (customerId) => {
  const response = await api.get(`support/conversations/list/?customer_id=${customerId}`);
  return response.data;
};

export default api;
