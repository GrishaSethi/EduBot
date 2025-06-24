import React, { useState } from 'react';
import { achievements, unlockAchievement } from '../utils/achievements';
import Achievements from './Achievements';
import { recordIncorrectAnswer } from '../utils/performanceTracker';
import { getFeedbackForScore } from '../utils/feedbackUtils';

const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

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

    // Record performance before calculating score
    quiz.forEach((question, index) => {
      if (selectedAnswers[index] !== question.answer && !skippedQuestions[index]) {
        recordIncorrectAnswer(topic);
      }
    });

    const score = calculateScore();
    const attemptedQuestions = quiz.length - Object.keys(skippedQuestions).length;
    const newUnlocks = [];

    // Achievement logic
    if (unlockAchievement(achievements.FIRST_QUIZ.id)) newUnlocks.push(achievements.FIRST_QUIZ.id);
    if (hintsRemaining === 3 && Object.keys(revealedHints).length === 0) {
      if (unlockAchievement(achievements.NO_HINTS.id)) newUnlocks.push(achievements.NO_HINTS.id);
    }
    if (attemptedQuestions > 0 && score === attemptedQuestions) {
      if (unlockAchievement(achievements.PERFECT_SCORE.id)) newUnlocks.push(achievements.PERFECT_SCORE.id);
    }
    setNewlyUnlocked(newUnlocks);

    // Feedback logic
    const percentage = attemptedQuestions > 0 ? Math.round((score / attemptedQuestions) * 100) : 0;
    setFeedback(getFeedbackForScore(percentage));

    // Notify App component that the quiz is complete
    if (onQuizComplete) {
      onQuizComplete();
    }
  };

  const getOptionClass = (questionIndex, option) => {
    if (!showAnswers) {
      return selectedAnswers[questionIndex] === option ? 'bg-indigo-100 border-indigo-400' : 'bg-white hover:bg-gray-50';
    }
    const correctAnswer = quiz[questionIndex].answer;
    if (option === correctAnswer) return 'bg-green-100 border-green-400';
    if (selectedAnswers[questionIndex] === option) return 'bg-red-100 border-red-400';
    return 'bg-white';
  };

  const attemptedQuestions = quiz.length - Object.keys(skippedQuestions).length;

  return (
    <div className="mt-10 space-y-8">
      {!showAnswers && (
        <div className="flex justify-around p-4 bg-white/60 backdrop-blur-sm rounded-lg shadow-inner">
          <p className="font-bold text-lg text-indigo-700">Hints: {hintsRemaining}</p>
          <p className="font-bold text-lg text-purple-700">50/50: {powerUps.eliminateTwo}</p>
          <p className="font-bold text-lg text-teal-700">Skip: {powerUps.skipQuestion}</p>
        </div>
      )}

      {quiz.map((q, index) => {
        const isSkipped = skippedQuestions[index];
        const eliminated = eliminatedOptions[index] || [];
        return (
        <div key={index} className={`bg-white/80 p-6 rounded-xl shadow-md transition-all duration-300 ${isSkipped ? 'opacity-50 bg-gray-100' : ''}`}>
          <p className="font-bold text-xl text-gray-800 mb-4">{index + 1}. {q.question}</p>
          {isSkipped && <p className='text-center font-bold text-gray-500 text-lg'>SKIPPED</p>}
          <div className="space-y-3">
            {q.options.map((option, i) => {
              const isEliminated = eliminated.includes(option);
              return (
              <button
                key={i}
                onClick={() => handleOptionSelect(index, option)}
                disabled={showAnswers || isSkipped || isEliminated}
                className={`w-full flex justify-between items-center text-left p-4 rounded-lg border-2 transition-all duration-200 ${getOptionClass(index, option)} ${isEliminated ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="font-medium text-gray-700">{option}</span>
                {showAnswers && (
                  quiz[index].answer === option ? <CheckIcon /> : (selectedAnswers[index] === option && <XIcon />)
                )}
              </button>
            )})}
          </div>
          {!showAnswers && !isSkipped && (
          <div className="mt-4 pt-4 border-t flex justify-end items-center gap-4">
              {q.hint && (
                <div>
                  {revealedHints[index] ? (
                      <p className="text-left text-sm text-gray-600 bg-indigo-50 p-2 rounded-md">{q.hint}</p>
                  ) : (
                    <button 
                      onClick={() => revealHint(index)} 
                      disabled={hintsRemaining === 0}
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 disabled:text-gray-400"
                    >
                      Show Hint
                    </button>
                  )}
                </div>
              )}
              <button onClick={() => useEliminateTwo(index)} disabled={powerUps.eliminateTwo === 0 || eliminatedOptions[index]} className='text-sm font-semibold text-purple-600 hover:text-purple-800 disabled:text-gray-400'>50/50</button>
              <button onClick={() => useSkipQuestion(index)} disabled={powerUps.skipQuestion === 0} className='text-sm font-semibold text-teal-600 hover:text-teal-800 disabled:text-gray-400'>Skip</button>
          </div>
          )}
          {showAnswers && q.explanation && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="font-bold text-gray-800">Explanation:</p>
              <p className="text-gray-600 mt-1">{q.explanation}</p>
            </div>
          )}
        </div>
        )})
      }

      {!showAnswers ? (
        <button 
          onClick={handleSubmit}
          className="w-full text-lg font-semibold text-white py-4 px-6 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Submit & See Results
        </button>
      ) : (
        <>
          <div className="text-center bg-white/80 p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800">Quiz Complete!</h2>
            <p className="text-xl text-gray-600 mt-2">You scored:</p>
            <p className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 my-4">
              {calculateScore()} / {attemptedQuestions}
            </p>
            <p className="text-gray-700">{feedback.caption}</p>
            {feedback.meme && <img src={feedback.meme} alt="Quiz result meme" className="mt-4 mx-auto rounded-lg shadow-lg max-h-64" />}
          </div>
          <Achievements newUnlocks={newlyUnlocked} />
        </>
      )}
    </div>
  );
};

export default QuizDisplay;
