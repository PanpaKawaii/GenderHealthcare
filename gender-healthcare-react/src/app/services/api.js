import axios from 'axios';
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const accountAPI = {
  login: (credentials) => api.post('/accounts/login', credentials),
  register: (userData) => api.post('/accounts/register', userData),
  getCurrentUser: () => api.get('/accounts/me'),
  updateProfile: (data) => api.put('/accounts/me', data),
};

export const customerAPI = {
  getProfile: () => api.get('/customers/me'),
  updateProfile: (data) => api.put('/customers/me', data),
};

export const counselorAPI = {
  getAll: () => api.get('/counselors'),
  getById: (id) => api.get(`/counselors/${id}`),
};

export const questionAPI = {
  getAll: (params) => api.get('/questions', { params }),
  getById: (id) => api.get(`/questions/${id}`),
  create: (data) => api.post('/questions', data),
  update: (id, data) => api.put(`/questions/${id}`, data),
  delete: (id) => api.delete(`/questions/${id}`),
};

export const commentAPI = {
  getByQuestionId: (questionId) => api.get(`/questions/${questionId}/comments`),
  create: ( data) => api.post(`/questions/${data.questionId}/comments`, data),
  
  update: (id, data) => api.put(`/comments/${id}`, data),
  delete: (id) => api.delete(`/comments/${id}`),
};

export const cycleAPI = {
  getAll: () => api.get('/cycles'),
  create: (data) => api.post('/cycles', data),
  update: (id, data) => api.put(`/cycles/${id}`, data),
  delete: (id) => api.delete(`/cycles/${id}`),
};

export const reminderAPI = {
  getAll: () => api.get('/reminders'),
  create: (data) => api.post('/reminders', data),
  update: (id, data) => api.put(`/reminders/${id}`, data),
  delete: (id) => api.delete(`/reminders/${id}`),
};
