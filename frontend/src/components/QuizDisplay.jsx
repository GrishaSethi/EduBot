import React, { useState } from 'react';
import { achievements, unlockAchievement } from '../utils/achievements';
import Achievements from './Achievements';
import { recordIncorrectAnswer } from '../utils/performanceTracker';
import { getFeedbackForScore } from '../utils/feedbackUtils';

const CheckIcon = () => (
  <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  </div>
);

const XIcon = () => (
  <div className="flex items-center justify-center w-8 h-8 bg-red-500 rounded-full">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </div>
);

const QuizDisplay = ({ quiz, topic, onQuizComplete }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [revealedHints, setRevealedHints] = useState({});
  const [newlyUnlocked, setNewlyUnlocked] = useState([]);
  const [powerUps, setPowerUps] = useState({ eliminateTwo: 1, skipQuestion: 1 });
  const [eliminatedOptions, setEliminatedOptions] = useState({});
  const [skippedQuestions, setSkippedQuestions] = useState({});
  const [feedback, setFeedback] = useState({ caption: '', meme: '' });

  const handleOptionSelect = (questionIndex, option) => {
    if (skippedQuestions[questionIndex]) return;
    setSelectedAnswers(prev => ({ ...prev, [questionIndex]: option }));
  };

  const revealHint = (questionIndex) => {
    if (revealedHints[questionIndex] || showAnswers) return;
    if (hintsRemaining > 0) {
      setHintsRemaining(prev => prev - 1);
      setRevealedHints(prev => ({ ...prev, [questionIndex]: true }));
    } else {
      alert("You have no hints left!");
    }
  };

  const useEliminateTwo = (questionIndex) => {
    if (powerUps.eliminateTwo > 0 && !eliminatedOptions[questionIndex]) {
      const correctAnswer = quiz[questionIndex].answer;
      const wrongOptions = quiz[questionIndex].options.filter(opt => opt !== correctAnswer);
      const toEliminate = wrongOptions.sort(() => 0.5 - Math.random()).slice(0, 2);
      
      setEliminatedOptions(prev => ({ ...prev, [questionIndex]: toEliminate }));
      setPowerUps(prev => ({ ...prev, eliminateTwo: prev.eliminateTwo - 1 }));
    }
  };

  const useSkipQuestion = (questionIndex) => {
    if (powerUps.skipQuestion > 0 && !skippedQuestions[questionIndex]) {
      setSkippedQuestions(prev => ({ ...prev, [questionIndex]: true }));
      setPowerUps(prev => ({ ...prev, skipQuestion: prev.skipQuestion - 1 }));
    }
  };

  const calculateScore = () => {
    return quiz.reduce((score, question, index) => {
      if (skippedQuestions[index]) return score;
      return selectedAnswers[index] === question.answer ? score + 1 : score;
    }, 0);
  };

  const handleSubmit = () => {
    setShowAnswers(true);

    quiz.forEach((question, index) => {
      if (selectedAnswers[index] !== question.answer && !skippedQuestions[index]) {
        recordIncorrectAnswer(topic);
      }
    });

    const score = calculateScore();
    const attemptedQuestions = quiz.length - Object.keys(skippedQuestions).length;
    const newUnlocks = [];

    if (unlockAchievement(achievements.FIRST_QUIZ.id)) newUnlocks.push(achievements.FIRST_QUIZ.id);
    if (hintsRemaining === 3 && Object.keys(revealedHints).length === 0) {
      if (unlockAchievement(achievements.NO_HINTS.id)) newUnlocks.push(achievements.NO_HINTS.id);
    }
    if (attemptedQuestions > 0 && score === attemptedQuestions) {
      if (unlockAchievement(achievements.PERFECT_SCORE.id)) newUnlocks.push(achievements.PERFECT_SCORE.id);
    }
    setNewlyUnlocked(newUnlocks);

    const percentage = attemptedQuestions > 0 ? Math.round((score / attemptedQuestions) * 100) : 0;
    setFeedback(getFeedbackForScore(percentage));

    if (onQuizComplete) {
      onQuizComplete();
    }
  };

  const getOptionClass = (questionIndex, option) => {
    if (!showAnswers) {
      return selectedAnswers[questionIndex] === option 
        ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-400 shadow-lg transform scale-105' 
        : 'bg-white hover:bg-gray-50 hover:border-gray-300 hover:shadow-md';
    }
    const correctAnswer = quiz[questionIndex].answer;
    if (option === correctAnswer) return 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-400 shadow-lg';
    if (selectedAnswers[questionIndex] === option) return 'bg-gradient-to-r from-red-100 to-pink-100 border-red-400 shadow-lg';
    return 'bg-white';
  };

  const attemptedQuestions = quiz.length - Object.keys(skippedQuestions).length;

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Quiz: {topic}</h2>
        <p className="text-gray-600 text-lg">Test your knowledge and have fun! 🎓</p>
      </div>

      {!showAnswers && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100 shadow-lg">
          <div className="flex justify-around items-center">
            <div className="text-center">
              <div className="text-3xl mb-2">💡</div>
              <p className="font-bold text-lg text-indigo-700">Hints: {hintsRemaining}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <p className="font-bold text-lg text-purple-700">50/50: {powerUps.eliminateTwo}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">⏭️</div>
              <p className="font-bold text-lg text-teal-700">Skip: {powerUps.skipQuestion}</p>
            </div>
          </div>
        </div>
      )}

      {quiz.map((q, index) => {
        const isSkipped = skippedQuestions[index];
        const eliminated = eliminatedOptions[index] || [];
        return (
        <div key={index} className={`bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 transition-all duration-300 ${isSkipped ? 'opacity-50 bg-gray-100' : 'hover:shadow-2xl'}`}>
          <div className="flex items-start mb-6">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xl rounded-full flex items-center justify-center mr-4">
              {index + 1}
            </div>
            <p className="font-bold text-xl text-gray-800 leading-relaxed">{q.question}</p>
          </div>
          
          {isSkipped && (
            <div className="text-center py-4 bg-gray-100 rounded-xl mb-4">
              <p className='font-bold text-gray-500 text-lg'>⏭️ SKIPPED</p>
            </div>
          )}
          
          <div className="space-y-4">
            {q.options.map((option, i) => {
              const isEliminated = eliminated.includes(option);
              return (
              <button
                key={i}
                onClick={() => handleOptionSelect(index, option)}
                disabled={showAnswers || isSkipped || isEliminated}
                className={`w-full flex justify-between items-center text-left p-6 rounded-xl border-2 transition-all duration-300 ${getOptionClass(index, option)} ${isEliminated ? 'opacity-30 cursor-not-allowed' : 'hover:transform hover:scale-102'}`}
              >
                <span className="font-medium text-gray-700 text-lg">{option}</span>
                {showAnswers && (
                  quiz[index].answer === option ? <CheckIcon /> : (selectedAnswers[index] === option && <XIcon />)
                )}
              </button>
            )})}
          </div>
          
          {!showAnswers && !isSkipped && (
          <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end items-center gap-4">
              {q.hint && (
                <div>
                  {revealedHints[index] ? (
                      <div className="text-left text-sm text-gray-600 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-200">
                        <span className="font-semibold text-indigo-700">💡 Hint:</span> {q.hint}
                      </div>
                  ) : (
                    <button 
                      onClick={() => revealHint(index)} 
                      disabled={hintsRemaining === 0}
                      className="inline-flex items-center px-4 py-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 disabled:text-gray-400 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                      💡 Show Hint
                    </button>
                  )}
                </div>
              )}
              <button 
                onClick={() => useEliminateTwo(index)} 
                disabled={powerUps.eliminateTwo === 0 || eliminatedOptions[index]} 
                className='inline-flex items-center px-4 py-2 text-sm font-semibold text-purple-600 hover:text-purple-800 disabled:text-gray-400 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors'
              >
                🎯 50/50
              </button>
              <button 
                onClick={() => useSkipQuestion(index)} 
                disabled={powerUps.skipQuestion === 0} 
                className='inline-flex items-center px-4 py-2 text-sm font-semibold text-teal-600 hover:text-teal-800 disabled:text-gray-400 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors'
              >
                ⏭️ Skip
              </button>
          </div>
          )}
          
          {showAnswers && q.explanation && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
                <p className="font-bold text-blue-800 mb-2">💭 Explanation:</p>
                <p className="text-gray-700">{q.explanation}</p>
              </div>
            </div>
          )}
        </div>
        )})
      }

      {!showAnswers ? (
        <button 
          onClick={handleSubmit}
          className="w-full text-xl font-bold text-white py-6 px-8 rounded-2xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 group"
        >
          <div className="flex items-center justify-center">
            <span>🎯 Submit & See Results</span>
            <svg className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </button>
      ) : (
        <>
          <div className="text-center bg-gradient-to-r from-purple-50 to-pink-50 p-10 rounded-3xl shadow-2xl border border-purple-100">
            <div className="mb-6">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
              <p className="text-xl text-gray-600">You scored:</p>
            </div>
            
            <div className="mb-6">
              <p className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 animate-pulse">
                {calculateScore()} / {attemptedQuestions}
              </p>
            </div>
            
            <div className="bg-white/70 p-6 rounded-2xl border border-white/50">
              <p className="text-gray-700 text-lg font-medium">{feedback.caption}</p>
              {feedback.meme && (
                <div className="mt-4">
                  <img src={feedback.meme} alt="Quiz result meme" className="mx-auto rounded-2xl shadow-lg max-h-64 border-4 border-white" />
                </div>
              )}
            </div>
          </div>
          <Achievements newUnlocks={newlyUnlocked} />
        </>
      )}
    </div>
  );
};

export default QuizDisplay;
