import { api } from './api';
import { env } from '../../settings/env';

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

// Helper function to handle API errors
const handleApiRequest = async (apiCall) => {
  try {
    const response = await apiCall();
    return response;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    
    // Check if it's a network error (API server not running)
    if (!error.response) {
      console.error(`Cannot connect to API server at ${env.API_URL}. Please check if it's running.`);
    }
    
    throw error;
  }
};

// Export forum API functions
const forumAPI = {
  // Posts 
  getPosts: (params) => handleApiRequest(() => api.get('/posts', { params, headers: getAuthHeaders() })),
  getPostById: (id) => handleApiRequest(() => api.get(`/posts/${id}`, { headers: getAuthHeaders() })),
  createPost: (data) => handleApiRequest(() => api.post('/posts', data, { headers: getAuthHeaders() })),
  updatePost: (id, data) => handleApiRequest(() => api.put(`/posts/${id}`, data, { headers: getAuthHeaders() })),
  deletePost: (id) => handleApiRequest(() => api.delete(`/posts/${id}`, { headers: getAuthHeaders() })),
  votePost: (postId, data) => handleApiRequest(() => api.post(`/posts/${postId}/vote`, data, { headers: getAuthHeaders() })),
  incrementView: (postId) => handleApiRequest(() => api.patch(`/posts/${postId}/view`, {}, { headers: getAuthHeaders() })),
    // Comments
  getCommentsByPostId: (postId, accountId, page = 1, limit = 10) => 
    handleApiRequest(() => api.get(`/posts/${postId}/comments`, { params: { accountId, page, limit }, headers: getAuthHeaders() })),
  addComment: (postId, data) => handleApiRequest(() => api.post(`/posts/${postId}/comments`, data, { headers: getAuthHeaders() })),
  replyToComment: (commentId, data) => handleApiRequest(() => api.post(`/comments/${commentId}/replies`, data, { headers: getAuthHeaders() })),
  voteComment: (commentId, data) => handleApiRequest(() => api.post(`/comments/${commentId}/vote`, data, { headers: getAuthHeaders() })),
  getCommentReplies: (commentId) => handleApiRequest(() => api.get(`/comments/${commentId}/replies`, { headers: getAuthHeaders() })),
    // Moderation (for admin user)
  getPendingPosts: (page = 1, limit = 10) => handleApiRequest(() => api.get('/moderation/posts/pending', { params: { page, limit }, headers: getAuthHeaders() })),
  getPostsByStatus: (status, page = 1, limit = 10) => handleApiRequest(() => api.get(`/moderation/posts/${status}`, { params: { page, limit }, headers: getAuthHeaders() })),
  approvePost: (postId) => handleApiRequest(() => api.post(`/moderation/posts/${postId}/approve`, {}, { headers: getAuthHeaders() })),
  rejectPost: (postId, reason) => handleApiRequest(() => api.post(`/moderation/posts/${postId}/reject`, { reason }, { headers: getAuthHeaders() })),
  flagPost: (postId, reason) => handleApiRequest(() => api.post(`/moderation/posts/${postId}/flag`, { reason }, { headers: getAuthHeaders() })),
  getPendingComments: (page = 1, limit = 10) => handleApiRequest(() => api.get('/moderation/comments/pending', { params: { page, limit }, headers: getAuthHeaders() })),
  getCommentsByStatus: (status, page = 1, limit = 10) => handleApiRequest(() => api.get(`/moderation/comments/${status}`, { params: { page, limit }, headers: getAuthHeaders() })),
  approveComment: (commentId) => handleApiRequest(() => api.post(`/moderation/comments/${commentId}/approve`, {}, { headers: getAuthHeaders() })),
  rejectComment: (commentId, reason) => handleApiRequest(() => api.post(`/moderation/comments/${commentId}/reject`, { reason }, { headers: getAuthHeaders() })),
  flagComment: (commentId, reason) => handleApiRequest(() => api.post(`/moderation/comments/${commentId}/flag`, { reason }, { headers: getAuthHeaders() })),
  getModerationStats: () => handleApiRequest(() => api.get('/moderation/stats', { headers: getAuthHeaders() })),

  // Community Stats
  getCommunityStats: () => handleApiRequest(() => api.get('/stats/community', { headers: getAuthHeaders() })),
  
  // Helper methods
  getCategories: () => [
    "General Health",
    "Reproductive Health",
    "STI Prevention",
    "Pregnancy & Family Planning",
    "Menstrual Health",
    "Mental Health",
  ],
  
  getSuggestedTags: () => [
    "advice",
    "support",
    "question",
    "experience",
    "tips",
    "resources",
    "pregnancy",
    "contraception",
    "testing",
    "symptoms",
    "treatment",
    "mental-health",
    "anxiety",
    "depression",
    "relationships",
  ],
  
  getSortOptions: () => [
    { value: "newest", label: "Newest" },
    { value: "popular", label: "Most Popular" },
    { value: "votes", label: "Most Votes" }
  ],
};

export default forumAPI;
