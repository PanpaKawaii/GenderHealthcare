import {api} from './api';

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
  // User Authentication
  login: (data) => handleApiRequest(() => api.post('/auth/login', data)),
  register: (data) => handleApiRequest(() => api.post('/auth/register', data)),
  forgotPassword: (email) => handleApiRequest(() => api.post('/auth/forgot-password', { email })),
  resetPassword: (data) => handleApiRequest(() => api.post('/auth/reset-password', data)),
  verifyEmail: (token) => handleApiRequest(() => api.post(`/auth/verify-email/${token}`)),
  
  // User Profile
  getProfile: (id) => handleApiRequest(() => api.get(`/accounts/${id}`)),
  updateProfile: (id, data) => handleApiRequest(() => api.put(`/accounts/${id}`, data)),
  changePassword: (id, data) => handleApiRequest(() => 
    api.put(`/accounts/${id}/change-password`, data)
  ),
  
  // Admin User Management
  getAllUsers: () => handleApiRequest(() => api.get('/accounts')),
  getUserById: (id) => handleApiRequest(() => api.get(`/accounts/${id}`)),
  createUser: (data) => handleApiRequest(() => api.post('/accounts', data)),
  updateUser: (id, data) => handleApiRequest(() => api.put(`/accounts/${id}`, data)),
  deleteUser: (id) => handleApiRequest(() => api.delete(`/accounts/${id}`)),
  
  // User Status
  activateUser: (id) => handleApiRequest(() => api.patch(`/accounts/${id}/activate`)),
  deactivateUser: (id) => handleApiRequest(() => api.patch(`/accounts/${id}/deactivate`)),
  
  // Role Management
  changeUserRole: (id, role) => handleApiRequest(() => 
    api.patch(`/accounts/${id}/change-role`, { role })
  ),
  
  // User Search and Filtering
  searchUsers: (query) => handleApiRequest(() => 
    api.get('/accounts/search', { params: { q: query } })
  ),
  getUsersByRole: (role) => handleApiRequest(() => 
    api.get('/accounts', { params: { role } })
  ),
  
  // Statistics
  getUserStats: () => handleApiRequest(() => api.get('/accounts/stats')),
  
  // Export/Import
  exportUserData: (id) => handleApiRequest(() => api.get(`/accounts/${id}/export`)),
};

export default accountAPI;
