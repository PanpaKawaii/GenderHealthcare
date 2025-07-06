import { api } from './api';
import { env } from '../../settings/env';

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
  getPosts: (params) => handleApiRequest(() => api.get('/posts', { params })),
  getPostById: (id) => handleApiRequest(() => api.get(`/posts/${id}`)),
  createPost: (data) => handleApiRequest(() => api.post('/posts', data)),
  updatePost: (id, data) => handleApiRequest(() => api.put(`/posts/${id}`, data)),
  deletePost: (id) => handleApiRequest(() => api.delete(`/posts/${id}`)),
  votePost: (postId, data) => handleApiRequest(() => api.post(`/posts/${postId}/vote`, data)),
  incrementView: (postId) => handleApiRequest(() => api.patch(`/posts/${postId}/view`)),
    // Comments
  getCommentsByPostId: (postId, accountId, page = 1, limit = 10) => 
    handleApiRequest(() => api.get(`/posts/${postId}/comments`, { params: { accountId, page, limit } })),
  addComment: (postId, data) => handleApiRequest(() => api.post(`/posts/${postId}/comments`, data)),
  replyToComment: (commentId, data) => handleApiRequest(() => api.post(`/comments/${commentId}/replies`, data)),
  voteComment: (commentId, data) => handleApiRequest(() => api.post(`/comments/${commentId}/vote`, data)),
  getCommentReplies: (commentId) => handleApiRequest(() => api.get(`/comments/${commentId}/replies`)),
    // Moderation (for admin user)
  getPendingPosts: () => handleApiRequest(() => api.get('/moderation/posts/pending')),
  approvePost: (postId) => handleApiRequest(() => api.post(`/moderation/posts/${postId}/approve`)),
  rejectPost: (postId) => handleApiRequest(() => api.post(`/moderation/posts/${postId}/reject`)),
  getPendingComments: () => handleApiRequest(() => api.get('/moderation/comments/pending')),
  approveComment: (commentId) => handleApiRequest(() => api.post(`/moderation/comments/${commentId}/approve`)),
  rejectComment: (commentId) => handleApiRequest(() => api.post(`/moderation/comments/${commentId}/reject`)),
  getModerationStats: () => handleApiRequest(() => api.get('/moderation/stats')),
  // Forum Filters and Tabs - consolidated into a single getPosts function for simplicity
  // Note: The type parameter in the query will determine which posts to return:
  //  - 'all': All approved posts
  //  - 'questions': Posts with no answers from counselors
  //  - 'expert': Posts with answers from counselors
  //  - 'following': Posts that the current user has upvoted (requires accountId)
  //  - 'myPosts': Posts created by the current user (requires accountId)
  
  // Community Stats
  getCommunityStats: () => handleApiRequest(() => api.get('/stats/community')),
  
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
