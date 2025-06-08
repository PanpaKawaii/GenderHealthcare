import React, { useEffect, useState } from 'react';
import { commentAPI } from '../../../services/api';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

const QuestionDetail = ({ question, onClose }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await commentAPI.getByQuestionId(question._id);
      setComments(response.data);
    } catch (err) {
      setError('Failed to load comments');
      console.error('Error loading comments:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { 
    loadComments(); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question._id]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-5 max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
        <button 
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" 
          onClick={onClose}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="mb-6 pt-4">
          <h2 className="text-xl font-semibold mb-2">{question.title}</h2>
          <p className="text-gray-700">{question.content}</p>
          <div className="mt-2 text-sm text-gray-500">
            Posted by {question.accountId?.name || 'Anonymous'} on {new Date(question.createDate).toLocaleDateString()}
          </div>
          <div className="mt-1">
            <span className={`px-2 py-1 rounded text-xs ${
              question.status === 'Answered' ? 'bg-green-100 text-green-800' : 
              question.status === 'Closed' ? 'bg-red-100 text-red-800' : 
              'bg-yellow-100 text-yellow-800'
            }`}>
              {question.status}
            </span>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-4">Responses</h3>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-4">
              <p>Loading comments...</p>
            </div>
          ) : (
            comments.length > 0 ? (
              <CommentList comments={comments} />
            ) : (
              <p className="text-gray-500 italic">No responses yet. Be the first to respond!</p>
            )
          )}
          
          <div className="mt-6">
            <CommentForm questionId={question._id} refreshComments={loadComments} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;
