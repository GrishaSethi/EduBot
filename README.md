# 🎓 EduBot - AI-Powered Educational Assistant

> **Intel Unnati Project** - Revolutionizing Learning Through Interactive AI

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.18+-black.svg)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-38B2AC.svg)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-orange.svg)](https://ai.google.dev/)

---

## 🌟 **About Intel Unnati**

**Intel Unnati** is a transformative initiative aimed at democratizing education through cutting-edge AI technology. This project represents our commitment to making learning accessible, engaging, and personalized for students worldwide.

### 🎯 **Project Vision**
- **Democratizing Education**: Making quality education accessible to all
- **AI-Powered Learning**: Leveraging artificial intelligence for personalized learning experiences
- **Interactive Engagement**: Creating immersive and fun learning environments
- **Skill Development**: Fostering critical thinking and problem-solving skills

---

## 🚀 **Features**

### 📚 **Smart Quiz Generation**
- **AI-Powered Questions**: Generate quizzes on any topic using Gemini AI
- **Difficulty Levels**: Choose from Easy 😊, Medium 🤔, or Hard 🧠
- **Customizable**: Set number of questions (1-20)
- **Real-time Generation**: Instant quiz creation with detailed explanations

### 🎮 **Interactive Learning Experience**
- **Power-ups System**: 
  - 💡 **Hints**: Get helpful clues (3 per quiz)
  - 🎯 **50/50**: Eliminate two wrong answers
  - ⏭️ **Skip**: Skip difficult questions
- **Visual Feedback**: Beautiful animations and progress indicators
- **Achievement System**: Unlock badges and track progress

### 🤖 **AI Learning Assistant**
- **24/7 Support**: Get help anytime with the integrated chatbot
- **Voice Interaction**: Speak to the AI assistant
- **Text-to-Speech**: Listen to AI responses
- **Smart Suggestions**: Get related topics and examples
- **Markdown Support**: Rich formatting for better understanding

### 🏆 **Gamification Elements**
- **Achievement Badges**: 
  - 🥇 First Quiz Completion
  - 🧠 Perfect Score
  - 💡 No Hints Used
- **Performance Tracking**: Monitor learning progress
- **Progress Visualization**: Beautiful charts and statistics

### 🎨 **Modern UI/UX**
- **Glassmorphism Design**: Modern glass-like interface
- **Animated Elements**: Smooth transitions and micro-interactions
- **Responsive Design**: Works on all devices
- **Dark/Light Theme**: Comfortable viewing experience
- **Accessibility**: Inclusive design for all users

---

## 🛠️ **Technology Stack**

### **Frontend**
- ⚛️ **React 18** - Modern UI framework
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🚀 **Vite** - Fast build tool
- 📱 **Responsive Design** - Mobile-first approach

### **Backend**
- 🟢 **Node.js** - JavaScript runtime
- 🚂 **Express.js** - Web application framework
- 🔄 **Nodemon** - Development server
- 🔒 **CORS** - Cross-origin resource sharing

### **AI Integration**
- 🤖 **Google Gemini AI** - Advanced language model
- 🔑 **API Integration** - RESTful API endpoints
- 📝 **Prompt Engineering** - Optimized AI prompts

### **Development Tools**
- 📦 **npm** - Package manager
- 🔍 **ESLint** - Code quality
- 🎯 **TypeScript** - Type safety (optional)

---

## 📦 **Installation & Setup**

### **Prerequisites**
- Node.js (v18 or higher)
- npm (v8 or higher)
- Google Gemini API key

### **1. Clone the Repository**
```bash
git clone https://github.com/GrishaSethi/EduBot.git
cd edubot-intel-unnati
```

### **2. Install Dependencies**

#### **Backend Setup**
```bash
npm install
```

#### **Frontend Setup**
```bash
cd frontend
npm install
cd ..
```

### **3. Environment Configuration**

Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**Get your Gemini API key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy and paste it in the `.env` file

### **4. Start the Application**

#### **Start Backend Server**
```bash
npm run dev
```
Backend will run on: `http://localhost:5001`

#### **Start Frontend Server** (in a new terminal)
```bash
cd frontend
npm run dev
```
Frontend will run on: `http://localhost:5173`

### **5. Access the Application**
Open your browser and navigate to: `http://localhost:5173`

---

## Project Assets

- 📄 [Project Report](assets/report.docx)
- 🎬 [Demo Video](assets/demo_video.mp4)

## 🏗️ **Project Structure**

```
quiz+chatbot/
├── 📁 frontend/                 # React frontend application
│   ├── 📁 src/
│   │   ├── 📁 components/       # React components
│   │   │   ├── 🎯 QuizForm.jsx
│   │   │   ├── 📝 QuizDisplay.jsx
│   │   │   ├── 🤖 Chatbot.jsx
│   │   │   └── 🏆 Achievements.jsx
│   │   ├── 📁 utils/           # Utility functions
│   │   ├── 📁 contexts/        # React contexts
│   │   └── 📁 styles/          # CSS styles
│   └── 📁 public/              # Static assets
├── 📁 routes/                  # Express.js routes
│   ├── 🎯 quiz.js             # Quiz generation endpoints
│   └── 🤖 chatbot.js          # Chatbot endpoints
├── 📁 utils/                   # Backend utilities
│   └── 📝 generatePrompt.js   # AI prompt generation
├── 🚀 index.js                # Main server file
└── 📋 package.json            # Project dependencies
```

---

## 🔧 **API Endpoints**

### **Quiz Generation**
```http
POST /api/generate-quiz
Content-Type: application/json

{
  "topic": "Quantum Physics",
  "numQuestions": 5,
  "difficulty": "medium"
}
```

### **Chatbot**
```http
POST /api/chatbot
Content-Type: application/json

{
  "message": "Explain photosynthesis"
}
```

---

## 🎨 **Customization**

### **Styling**
- Modify `frontend/src/index.css` for global styles
- Update `frontend/tailwind.config.js` for theme customization
- Edit component files for specific styling

### **AI Prompts**
- Customize prompts in `utils/generatePrompt.js`
- Adjust chatbot behavior in `routes/chatbot.js`

### **Features**
- Add new power-ups in `QuizDisplay.jsx`
- Create new achievements in `utils/achievements.js`
- Extend API endpoints in route files

---

## 🧪 **Testing**

### **Backend Testing**
```bash
# Test API endpoints
curl http://localhost:5001
curl -X POST http://localhost:5001/api/generate-quiz \
  -H "Content-Type: application/json" \
  -d '{"topic":"Math","numQuestions":3,"difficulty":"easy"}'
```

### **Frontend Testing**
- Open browser developer tools
- Check console for errors
- Test responsive design on different screen sizes

---

## 🚀 **Deployment**

### **Backend Deployment**
1. Set up environment variables on your hosting platform
2. Deploy to platforms like:
   - **Heroku**
   - **Vercel**
   - **Railway**
   - **DigitalOcean**

### **Frontend Deployment**
1. Build the project: `npm run build`
2. Deploy to platforms like:
   - **Vercel**
   - **Netlify**
   - **GitHub Pages**

---

## 🙏 **Acknowledgments**

- **Intel Unnati** for the vision and support
- **Google Gemini AI** for powerful AI capabilities
- **React & Express** communities for amazing frameworks
- **Open Source Contributors** for inspiration and tools

---

Happy Quizzing! 🚀
