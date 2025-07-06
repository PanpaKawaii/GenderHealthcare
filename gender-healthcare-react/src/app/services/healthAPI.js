import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to handle API requests and their errors
const handleApiRequest = async (requestFn) => {
  try {
    const response = await requestFn();
    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export const cycleAPI = {
  getByCustomer: (customerId) => handleApiRequest(() => api.get(`/cycles/by-customer/${customerId}`)),
  getOne: (id) => handleApiRequest(() => api.get(`/cycles/by-id/${id}`)),
  create: (data) => handleApiRequest(() => api.post('/cycles', data)),
  update: (id, data) => handleApiRequest(() => api.put(`/cycles/${id}`, data)),
  delete: (id) => handleApiRequest(() => api.delete(`/cycles/${id}`)),
};

export const reminderAPI = {
  getByCustomer: (customerId) => handleApiRequest(() => api.get(`/reminders/by-customer/${customerId}`)),
  getOne: (id) => handleApiRequest(() => api.get(`/reminders/by-id/${id}`)),
  create: (data) => handleApiRequest(() => api.post('/reminders', data)),
  update: (id, data) => handleApiRequest(() => api.put(`/reminders/${id}`, data)),
  delete: (id) => handleApiRequest(() => api.delete(`/reminders/${id}`)),
  toggleActive: (id, isActive) => handleApiRequest(() => api.patch(`/reminders/${id}/toggle`, { isActive })),
};
