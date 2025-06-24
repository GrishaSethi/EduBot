import { Router } from 'express';
import axios from 'axios';
import { generatePrompt } from '../utils/generatePrompt.js';

const router = Router();

router.post('/generate-quiz', async (req, res) => {
  const { topic, numQuestions, difficulty } = req.body;

  // Input validation
  if (!topic || !numQuestions || !difficulty) {
    return res.status(400).json({ error: 'Missing required fields: topic, numQuestions, difficulty' });
  }

  if (typeof topic !== 'string' || topic.trim() === '') {
    return res.status(400).json({ error: 'Topic must be a non-empty string.' });
  }

  if (typeof numQuestions !== 'number' || !Number.isInteger(numQuestions) || numQuestions <= 0) {
    return res.status(400).json({ error: 'Number of questions must be a positive integer.' });
  }

  const validDifficulties = ['easy', 'medium', 'hard'];
  if (!validDifficulties.includes(difficulty.toLowerCase())) {
    return res.status(400).json({ error: 'Difficulty must be one of: easy, medium, hard.' });
  }

  const prompt = generatePrompt(topic, numQuestions, difficulty);

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key not found.' });
    }
                const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await axios.post(url, {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Extract the string response and clean it, as Gemini might add markdown formatting
    const quizDataString = response.data.candidates[0].content.parts[0].text;
    const cleanedString = quizDataString.replace(/```json\n|```/g, '').trim();
    
    const quiz = JSON.parse(cleanedString);

    res.json(quiz);
  } catch (error) {
        if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Gemini API Error Data:', JSON.stringify(error.response.data, null, 2));
      console.error('Gemini API Error Status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Gemini API No Response:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up Gemini API request:', error.message);
    }
    if (error instanceof SyntaxError) {
      return res.status(500).json({ error: 'Failed to parse the quiz data from the API.' });
    }
    res.status(500).json({ error: 'Failed to generate quiz. Please check the API key and try again.' });
  }
});

export default router;
