import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import quizRoutes from './routes/quiz.js';
import chatbotRoutes from './routes/chatbot.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api', quizRoutes);
app.use('/api', chatbotRoutes);

// A simple route for testing if the server is up
app.get('/', (req, res) => {
  res.send('EduBot - AI-Powered Educational Assistant Backend is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
