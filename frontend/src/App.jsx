import React, { useState } from 'react';
import axios from 'axios';
import QuizForm from './components/QuizForm';
import QuizDisplay from './components/QuizDisplay';
import { getTopicSuggestion } from './utils/performanceTracker';
import Chatbot from './components/Chatbot';

function App() {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTopic, setCurrentTopic] = useState('');
  const [topicSuggestion, setTopicSuggestion] = useState(null);

  const generateQuiz = async (formData) => {
    setLoading(true);
    setError(null);
    setQuiz(null);
    setTopicSuggestion(null);
    setCurrentTopic(formData.topic);

    try {
      const response = await axios.post('/api/generate-quiz', formData);
      const quizData = {
        topic: formData.topic,
        questions: response.data
      }
      setQuiz(quizData);
    } catch (err) {
      setError('Failed to generate quiz. Please check the backend server and your API key.');
      console.error(err);
    }
    setLoading(false);
  };

  const handleQuizComplete = () => {
    const suggestion = getTopicSuggestion();
    setTopicSuggestion(suggestion);
  };

  const handleSuggestionClick = () => {
    if (topicSuggestion) {
      generateQuiz({ topic: topicSuggestion, numQuestions: 5 });
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 relative z-10">
          <header className="text-center mb-12">
            <div className="relative inline-block">
              <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 animate-gradient-x">
                EduBot
              </h1>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce"></div>
            </div>
            <p className="mt-6 text-lg text-gray-600 font-medium">
              Your AI-Powered Educational Assistant for interactive learning and quizzes.
            </p>
            <div className="mt-4 flex justify-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800">
                🚀 Interactive Learning
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800">
                🎯 Personalized Quizzes
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800">
                🤖 AI Assistant
              </span>
            </div>
          </header>

          <main className="space-y-8">
            {quiz ? (
              <QuizDisplay
                quiz={quiz.questions}
                topic={quiz.topic}
                onQuizComplete={handleQuizComplete}
              />
            ) : (
              <QuizForm
                onGenerate={generateQuiz}
                loading={loading}
              />
            )}
          </main>

          {topicSuggestion && (
            <div className="mt-10 text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
              <p className="text-gray-700 font-medium mb-4">How about another quiz to practice?</p>
              <button
                onClick={handleSuggestionClick}
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
              >
                <span>Start a '{topicSuggestion}' Quiz</span>
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
      <Chatbot />
    </>
  );
}

export default App;
