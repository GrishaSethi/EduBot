# EduBot - Your AI-Powered Educational Assistant

EduBot is a modern full-stack educational platform that combines interactive learning with an intelligent chatbot interface. Built with React, Node.js, and Express, EduBot provides an engaging way to enhance learning through quizzes and AI-powered assistance.

## Features

- **Interactive Learning**: Create and take custom quizzes on various educational topics
- **AI-Powered Assistant**: Get personalized educational support through an intelligent chat interface
- **Responsive Design**: Seamless learning experience across all devices
- **Modern UI**: Clean, intuitive interface built with Tailwind CSS
- **Performance Optimized**: Efficient state management and code splitting

## Tech Stack

### Frontend
- React 18
- Vite (Build Tool)
- Tailwind CSS (Styling)
- Axios (HTTP Client)

### Backend
- Node.js
- Express.js
- CORS (Cross-Origin Resource Sharing)
- dotenv (Environment Variables)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher) or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/GrishaSethi/EduBot.git
   cd EduBot
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3001
   GEMINI_API_KEY=your_gemini_api_key_here
   # Add other environment variables as needed
   ```
   
   **Note**: Replace `your_gemini_api_key_here` with your actual Gemini API key.

### Running the Application

1. **Start the backend server** (from the root directory)
   ```bash
   npm run dev
   ```
   The backend will be available at `http://localhost:3001`

2. **Start the frontend development server** (from the frontend directory)
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

## Project Structure

```
EduBot/
├── frontend/           # Frontend React application
│   ├── public/         # Static files
│   ├── src/            # Source files
│   │   ├── components/ # React components
│   │   ├── contexts/   # React contexts
│   │   ├── utils/      # Utility functions
│   │   └── ...
│   └── ...
├── routes/            # API route handlers
├── utils/             # Backend utilities
├── .env               # Environment variables
├── package.json       # Backend dependencies
└── frontend/package.json  # Frontend dependencies
```

## Available Scripts

### Backend
- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot-reload

### Frontend (from frontend directory)
- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Acknowledgments

- Built with [Create React App](https://create-react-app.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [React Icons](https://react-icons.github.io/react-icons/)

---

Happy Quizzing! 🚀
