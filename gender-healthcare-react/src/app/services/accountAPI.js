import {api} from './api';

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

// Helper function to handle API requests
const handleApiRequest = async (apiCall) => {
  try {
    const response = await apiCall();
    return response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

const accountAPI = {
  // User Authentication - No auth headers needed for these endpoints
  login: (data) => handleApiRequest(() => api.post('/auth/login', data)),
  register: (data) => handleApiRequest(() => api.post('/auth/register', data)),
  forgotPassword: (email) => handleApiRequest(() => api.post('/auth/forgot-password', { email })),
  resetPassword: (data) => handleApiRequest(() => api.post('/auth/reset-password', data)),
  verifyEmail: (token) => handleApiRequest(() => api.post(`/auth/verify-email/${token}`)),
  
  // User Profile - Need auth headers
  getProfile: (id) => handleApiRequest(() => api.get(`/accounts/${id}`, { headers: getAuthHeaders() })),
  updateProfile: (id, data) => handleApiRequest(() => api.put(`/accounts/${id}`, data, { headers: getAuthHeaders() })),
  changePassword: (id, data) => handleApiRequest(() => 
    api.put(`/accounts/${id}/change-password`, data, { headers: getAuthHeaders() })
  ),
  
  // Admin User Management - Need auth headers
  getAllUsers: () => handleApiRequest(() => api.get('/accounts', { headers: getAuthHeaders() })),
  getUserById: (id) => handleApiRequest(() => api.get(`/accounts/${id}`, { headers: getAuthHeaders() })),
  createUser: (data) => handleApiRequest(() => api.post('/accounts', data, { headers: getAuthHeaders() })),
  updateUser: (id, data) => handleApiRequest(() => api.put(`/accounts/${id}`, data, { headers: getAuthHeaders() })),
  deleteUser: (id) => handleApiRequest(() => api.delete(`/accounts/${id}`, { headers: getAuthHeaders() })),
  
  // User Status - Need auth headers
  activateUser: (id) => handleApiRequest(() => api.patch(`/accounts/${id}/activate`, {}, { headers: getAuthHeaders() })),
  deactivateUser: (id) => handleApiRequest(() => api.patch(`/accounts/${id}/deactivate`, {}, { headers: getAuthHeaders() })),
  
  // Role Management - Need auth headers
  changeUserRole: (id, role) => handleApiRequest(() => 
    api.patch(`/accounts/${id}/change-role`, { role }, { headers: getAuthHeaders() })
  ),
  
  // User Search and Filtering - Need auth headers
  searchUsers: (query) => handleApiRequest(() => 
    api.get('/accounts/search', { params: { q: query }, headers: getAuthHeaders() })
  ),
  getUsersByRole: (role) => handleApiRequest(() => 
    api.get('/accounts', { params: { role }, headers: getAuthHeaders() })
  ),
  
  // Statistics - Need auth headers
  getUserStats: () => handleApiRequest(() => api.get('/accounts/stats', { headers: getAuthHeaders() })),
  
  // Export/Import - Need auth headers
  exportUserData: (id) => handleApiRequest(() => api.get(`/accounts/${id}/export`, { headers: getAuthHeaders() })),
};

export default accountAPI;
