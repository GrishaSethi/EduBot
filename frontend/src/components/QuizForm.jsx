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

  const inputStyle = "w-full px-6 py-4 bg-white/70 border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-400 transition-all duration-300 text-lg font-medium";

  const difficultyColors = {
    easy: 'from-green-400 to-emerald-500',
    medium: 'from-yellow-400 to-orange-500',
    hard: 'from-red-400 to-pink-500'
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Your Quiz</h2>
        <p className="text-gray-600">Let's make learning fun and engaging! 🎓</p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="topic" className="block text-gray-700 font-bold mb-3 text-lg">
            <span className="inline-flex items-center">
              📚 Topic
              <span className="ml-2 text-sm font-normal text-gray-500">(What would you like to learn?)</span>
            </span>
          </label>
          <input
            type="text"
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            className={inputStyle}
            placeholder="e.g., The Renaissance, Quantum Physics, World History..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label htmlFor="difficulty" className="block text-gray-700 font-bold mb-3 text-lg">
              <span className="inline-flex items-center">
                🎯 Difficulty Level
              </span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['easy', 'medium', 'hard'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, difficulty: level }))}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    formData.difficulty === level
                      ? `bg-gradient-to-r ${difficultyColors[level]} text-white border-transparent shadow-lg`
                      : 'bg-white/70 border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">
                      {level === 'easy' ? '😊' : level === 'medium' ? '🤔' : '🧠'}
                    </div>
                    <div className="font-semibold capitalize">{level}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="numQuestions" className="block text-gray-700 font-bold mb-3 text-lg">
              <span className="inline-flex items-center">
                📝 Number of Questions
              </span>
            </label>
            <div className="relative">
              <input
                type="range"
                id="numQuestions"
                name="numQuestions"
                value={formData.numQuestions}
                onChange={handleChange}
                min="1"
                max="20"
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="mt-4 text-center">
                <span className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xl rounded-full shadow-lg">
                  {formData.numQuestions}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full text-xl font-bold text-white py-6 px-8 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
            <span>Creating Magic...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <span>🚀 Generate Quiz</span>
            <svg className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        )}
      </button>
    </form>
  );
};

export default QuizForm;
