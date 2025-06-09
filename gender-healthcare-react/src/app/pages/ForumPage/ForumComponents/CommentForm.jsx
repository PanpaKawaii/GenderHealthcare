import React, { useState } from 'react';
import { commentAPI } from '../../../services/api';

const CommentForm = ({ questionId, parentCommentId = null, refreshComments, onCancel }) => {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      await commentAPI.create({
        questionId,
        content,
        parentCommentId
      });
      
      setContent('');
      refreshComments();
      if (onCancel) onCancel();
    } catch (err) {
      setError('Failed to submit your comment');
      console.error('Error submitting comment:', err);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded">
          {error}
        </div>
      )}
      
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={parentCommentId ? "Write a reply..." : "Add a response..."}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
          required
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
            disabled={submitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : parentCommentId ? 'Reply' : 'Post Response'}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;