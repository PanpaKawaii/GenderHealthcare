import React, { useState } from 'react';
import { commentAPI } from '../../../services/api'; 

const CommentForm = ({ questionId, refreshComments }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await commentAPI.create({ 
        questionId, 
        content 
      });
      setContent('');
      refreshComments();
    } catch (err) {
      setError('Failed to post your comment');
      console.error('Error posting comment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-sm">
          {error}
        </div>
      )}
      
      <div className="flex flex-col">
        <textarea
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200"
          placeholder="Write your response here..."
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={3}
          required
        />
        <div className="flex justify-end mt-2">
          <button 
            type="submit"
            disabled={loading || !content.trim()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post Response'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
