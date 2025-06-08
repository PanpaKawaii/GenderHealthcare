import React, { useState, useEffect } from 'react';
import { questionAPI } from '../../services/api';
import QuestionList from './ForumComponents/QuestionList';
import QuestionDetail from './ForumComponents/QuestionDetail';
import NewQuestionForm from './ForumComponents/NewQuestionForm';

const ForumPage = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showNewQuestionForm, setShowNewQuestionForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await questionAPI.getAll();
      setQuestions(response.data);
    } catch (err) {
      setError('Failed to load questions. Please try again.');
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSelectQuestion = (question) => {
    setSelectedQuestion(question);
  };

  const handleCloseQuestion = () => {
    setSelectedQuestion(null);
  };

  const handleCreateQuestion = async (questionData) => {
    try {
      await questionAPI.create(questionData);
      fetchQuestions();
      setShowNewQuestionForm(false);
    } catch (err) {
      console.error('Error creating question:', err);
      return false;
    }
    return true;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Health Forum</h1>
        <button 
          onClick={() => setShowNewQuestionForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Ask a Question
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">
          <div className="spinner"></div>
          <p className="mt-2">Loading questions...</p>
        </div>
      ) : (
        questions.length > 0 ? (
          <QuestionList questions={questions} onSelect={handleSelectQuestion} />
        ) : (
          <p className="text-center py-10">No questions yet. Be the first to ask!</p>
        )
      )}

      {selectedQuestion && (
        <QuestionDetail question={selectedQuestion} onClose={handleCloseQuestion} />
      )}

      {showNewQuestionForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded shadow-lg p-5 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Ask a Question</h2>
            <NewQuestionForm 
              onSubmit={handleCreateQuestion} 
              onCancel={() => setShowNewQuestionForm(false)} 
                accountId={"6650fe8e8f3a8d6ff13d22a1"}
              
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ForumPage;