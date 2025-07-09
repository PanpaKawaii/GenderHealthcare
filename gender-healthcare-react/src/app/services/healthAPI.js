import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to get authorization token
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : '';
};

// Helper function to get authorization headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: token } : {};
};

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
  getByCustomer: (customerId) => handleApiRequest(() => api.get(`/cycles/by-customer/${customerId}`, { headers: getAuthHeaders() })),
  getOne: (id) => handleApiRequest(() => api.get(`/cycles/by-id/${id}`, { headers: getAuthHeaders() })),
  create: (data) => handleApiRequest(() => api.post('/cycles', data, { headers: getAuthHeaders() })),
  update: (id, data) => handleApiRequest(() => api.put(`/cycles/${id}`, data, { headers: getAuthHeaders() })),
  delete: (id) => handleApiRequest(() => api.delete(`/cycles/${id}`, { headers: getAuthHeaders() })),
};

export const reminderAPI = {
  getByCustomer: (customerId) => handleApiRequest(() => api.get(`/reminders/by-customer/${customerId}`, { headers: getAuthHeaders() })),
  getOne: (id) => handleApiRequest(() => api.get(`/reminders/by-id/${id}`, { headers: getAuthHeaders() })),
  create: (data) => handleApiRequest(() => api.post('/reminders', data, { headers: getAuthHeaders() })),
  update: (id, data) => handleApiRequest(() => api.put(`/reminders/${id}`, data, { headers: getAuthHeaders() })),
  delete: (id) => handleApiRequest(() => api.delete(`/reminders/${id}`, { headers: getAuthHeaders() })),
  toggleActive: (id, isActive) => handleApiRequest(() => api.patch(`/reminders/${id}/toggle`, { isActive }, { headers: getAuthHeaders() })),
};
