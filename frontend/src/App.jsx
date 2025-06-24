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
    setTopicSuggestion(null); // Clear previous suggestion
    setCurrentTopic(formData.topic);

    try {
      const response = await axios.post('/api/generate-quiz', formData);
      // Pass topic along with quiz data
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
      <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans">
        <div className="w-full max-w-3xl mx-auto bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-lg">
          <header className="text-center mb-10">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              EduBot
            </h1>
            <p className="mt-4 text-gray-600">
              Your AI-Powered Educational Assistant for interactive learning and quizzes.
            </p>
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
            <div className="mt-8 text-center">
              <p className="text-gray-600">How about another quiz to practice?</p>
              <button
                onClick={handleSuggestionClick}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                Start a '{topicSuggestion}' Quiz
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
