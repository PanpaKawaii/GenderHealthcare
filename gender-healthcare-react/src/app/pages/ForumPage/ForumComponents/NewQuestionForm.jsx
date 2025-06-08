import React, { useState } from "react";

const NewQuestionForm = ({ onSubmit, onCancel,  }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      setError("Question content cannot be empty");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const success = await onSubmit({...formData,accountId: "6650fe8e8f3a8d6ff13d22a1"});
      if (success) {
        // Reset form on successful submission
        setFormData({
          title: "",
          content: "",
          type: ""
        });
      }
    } catch (err) {
      setError("Failed to post your question. Please try again.");
      console.error("Error submitting question:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
          placeholder="Brief title for your question"
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Question
        </label>
        <textarea
          id="content"
          name="content"
          rows={4}
          value={formData.content}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
          placeholder="What would you like to ask about reproductive health?"
          required
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
        >
          <option value="">Select a category (optional)</option>
          <option value="Menstrual Health">Menstrual Health</option>
          <option value="Fertility">Fertility</option>
          <option value="Contraception">Contraception</option>
          <option value="Pregnancy">Pregnancy</option>
          <option value="General">General</option>
        </select>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !formData.content.trim()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post Question"}
        </button>
      </div>
    </form>
  );
};

export default NewQuestionForm;
