import { Router } from 'express';
import axios from 'axios';

const router = Router();

router.post('/chatbot', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key not found.' });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await axios.post(url, {
      contents: [{
        parts: [{
          text: `You are a helpful learning assistant. Please answer the following question. Use markdown for formatting, including paragraphs, bullet points, and code blocks where appropriate: ${message}`
        }]
      }]
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const botResponse = response.data.candidates[0].content.parts[0].text;
    res.json({ response: botResponse });

  } catch (error) {
    if (error.response) {
      console.error('Gemini API Error Data:', JSON.stringify(error.response.data, null, 2));
      console.error('Gemini API Error Status:', error.response.status);
      res.status(500).json({ error: 'Failed to get response from AI.' });
    } else {
      console.error('Error setting up Gemini API request:', error.message);
      res.status(500).json({ error: 'Failed to communicate with the AI service.' });
    }
  }
});

export default router;
