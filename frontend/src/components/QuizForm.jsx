import React, { useState } from 'react';

const QuizForm = ({ onGenerate, loading }) => {
  const [formData, setFormData] = useState({
    topic: '',
    difficulty: 'easy',
    numQuestions: 5,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'numQuestions' ? parseInt(value) : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(formData);
  };

  const inputStyle = "w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="topic" className="block text-gray-700 font-semibold mb-2">Topic</label>
        <input
          type="text"
          id="topic"
          name="topic"
          value={formData.topic}
          onChange={handleChange}
          className={inputStyle}
          placeholder="e.g., The Renaissance"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="difficulty" className="block text-gray-700 font-semibold mb-2">Difficulty</label>
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className={inputStyle}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div>
          <label htmlFor="numQuestions" className="block text-gray-700 font-semibold mb-2">Number of Questions</label>
          <input
            type="number"
            id="numQuestions"
            name="numQuestions"
            value={formData.numQuestions}
            onChange={handleChange}
            className={inputStyle}
            min="1"
            max="20"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full text-lg font-semibold text-white py-4 px-6 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating Magic...' : 'Generate Quiz'}
      </button>
    </form>
  );
};

export default QuizForm;
