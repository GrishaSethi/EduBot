/**
 * Generates a prompt for the AI to create a quiz.
 * @param {string} topic - The topic of the quiz.
 * @param {number} numQuestions - The number of questions for the quiz.
 * @param {string} difficulty - The difficulty level of the quiz.
 * @returns {string} The generated prompt.
 */
export const generatePrompt = (topic, numQuestions, difficulty) => {
  return `Generate a multiple-choice quiz on the topic of "${topic}" with ${numQuestions} questions of ${difficulty} difficulty.
  Each question should have four options and one correct answer.
  
  IMPORTANT: You must return the quiz as a valid JSON array. Each object in the array represents a question and MUST have the following structure: { "question": "...", "options": [...], "answer": "...", "hint": "...", "explanation": "..." }.

  Here is an example of the required format for a single question object:
  {
    "question": "What is the powerhouse of the cell?",
    "options": ["Nucleus", "Ribosome", "Mitochondrion", "Golgi apparatus"],
    "answer": "Mitochondrion",
    "hint": "This organelle is responsible for generating most of the cell's supply of adenosine triphosphate (ATP).",
    "explanation": "The mitochondrion is known as the powerhouse of the cell because it generates most of the cell's supply of ATP, used as a source of chemical energy."
  }

  Now, generate the full quiz with ${numQuestions} questions in a single JSON array. Do not include any text, markdown, or any other characters outside of the JSON array itself.`;
};
