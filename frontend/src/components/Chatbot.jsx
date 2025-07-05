import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [isSpeechPaused, setIsSpeechPaused] = useState(false);
  
  const recognition = React.useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isOpen && isFullScreen) {
      setIsFullScreen(false);
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const speakMessage = (message) => {
    if (!window.speechSynthesis) {
      console.log('Speech synthesis not supported');
      return;
    }

    if (isSpeechPaused) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanedMessage = message
      .replace(/\*\s+/g, '')
      .replace(/`/g, '')
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanedMessage);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsSpeechPaused(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };
  };

  const handleSpeechToggle = () => {
    setIsSpeechEnabled(!isSpeechEnabled);
  };

  const handleVoiceInput = () => {
    if (isListening) {
      recognition.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    recognition.current = new SpeechRecognition();
    recognition.current.continuous = false;
    recognition.current.interimResults = false;
    recognition.current.lang = 'en-US';

    recognition.current.onstart = () => {
      setIsListening(true);
    };

    recognition.current.onend = () => {
      setIsListening(false);
    };

    recognition.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.current.start();
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await axios.post('/api/chatbot', { message: input });
      const botMessage = { 
        sender: 'bot', 
        text: response.data.response,
        suggestions: [
          { id: 'example', label: 'Explain with an example' },
          { id: 'summarize', label: 'Summarize this' },
          { id: 'related', label: 'Suggest Related Topics' }
        ]
      };
      if (isSpeechEnabled) {
        speakMessage(response.data.response);
      };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error fetching bot response:', error);
      const errorMessage = { sender: 'bot', text: 'Sorry, I am having trouble connecting. Please try again later.' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestion = async (suggestionId) => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.sender === 'bot') {
      const userQuestion = messages[messages.length - 2];
      
      const prompt = {
        example: `Based on your previous question about "${userQuestion.text}", please provide a practical example to help me understand this concept better.`,
        summarize: `Here's what you explained about "${userQuestion.text}". Please provide a concise summary of the key points.`,
        related: `You explained about "${userQuestion.text}". Please suggest 2-3 related concepts or subtopics that I might find interesting to explore next. Format your response like this: "You might also like: Topic 1, Topic 2, and Topic 3. Here's why each is interesting: [brief explanation]"`
      }[suggestionId];

      const userMessage = { sender: 'user', text: prompt };
      setMessages([...messages, userMessage]);
      setInput('');
      setIsTyping(true);

      try {
        const response = await axios.post('/api/chatbot', { message: prompt });
        const botMessage = { 
          sender: 'bot', 
          text: response.data.response,
          suggestions: [
            { id: 'example', label: 'Explain with an example' },
            { id: 'summarize', label: 'Summarize this' },
            { id: 'related', label: 'Suggest Related Topics' }
          ]
        };
        if (isSpeechEnabled) {
          speakMessage(response.data.response);
        };
        setMessages(prevMessages => [...prevMessages, botMessage]);
      } catch (error) {
        console.error('Error fetching bot response:', error);
        const errorMessage = { sender: 'bot', text: 'Sorry, I am having trouble connecting. Please try again later.' };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const chatWindow = (
    <div className={`fixed ${isFullScreen ? 'inset-0' : 'bottom-20 right-0 w-96 h-[500px]'} z-50 bg-white/95 backdrop-blur-xl flex flex-col transition-all duration-300 rounded-3xl shadow-2xl border border-white/20`}>
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-3xl flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">🤖</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">AI Learning Assistant</h3>
            <p className="text-sm text-gray-600">Ask me anything!</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={toggleFullScreen} className="p-2 text-gray-500 hover:text-gray-800 hover:bg-white/50 rounded-lg transition-colors">
            {isFullScreen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 16v-4h-4m-12 0H4v4m12-12v4h4m-12 0H4V4" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4h4m12 0h-4v4m0 12v4h4m-12 0h-4v-4" />
              </svg>
            )}
          </button>
          <button onClick={toggleChat} className="p-2 text-gray-500 hover:text-gray-800 hover:bg-white/50 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">👋</div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Hello! I'm your AI Learning Assistant</h4>
            <p className="text-gray-600 text-sm">Ask me questions about any topic, and I'll help you learn!</p>
          </div>
        )}
        
        {messages.map((msg, index) => (
          <div key={index} className={`my-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-2xl px-4 py-3 max-w-[80%] ${msg.sender === 'user' 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
              : 'bg-white text-gray-800 shadow-md border border-gray-100'
            }`}>
              {msg.sender === 'bot' ? (
                <div className="space-y-3">
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                  {msg.suggestions && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {msg.suggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          onClick={() => handleSuggestion(suggestion.id)}
                          className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 hover:from-blue-200 hover:to-purple-200 transition-all duration-200 font-medium"
                        >
                          {suggestion.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-sm">{msg.text}</span>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="my-4 flex justify-start">
            <div className='bg-white text-gray-800 rounded-2xl px-4 py-3 shadow-md border border-gray-100'>
              <div className='flex items-center space-x-2'>
                <span className='h-2 w-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]'></span>
                <span className='h-2 w-2 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.15s]'></span>
                <span className='h-2 w-2 bg-purple-500 rounded-full animate-bounce'></span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white rounded-b-3xl">
        <div className="flex space-x-3 items-end">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 text-gray-800 bg-white focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-400 transition-all duration-300"
            />
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={handleVoiceInput} 
              className={`p-3 rounded-xl transition-all duration-300 ${
                isListening 
                  ? 'bg-red-500 text-white shadow-lg animate-pulse' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="Voice Input"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-14 0m7 7v3m0 0H9m4 0h2M5 11a7 7 0 0114 0v3a1 1 0 01-1 1H6a1 1 0 01-1-1v-3z" />
              </svg>
            </button>
            
            <button 
              onClick={handleSpeechToggle} 
              className={`p-3 rounded-xl transition-all duration-300 ${
                isSpeechEnabled 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="Text-to-Speech"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0v-7m0 0V5a2 2 0 012-2h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V19m-6 0a7 7 0 01-7-7m0 0v7m0 0V5a2 2 0 012-2h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V19z" />
              </svg>
            </button>
            
            {isSpeechEnabled && (
              <button 
                onClick={() => {
                  if (isSpeaking) {
                    setIsSpeechPaused(!isSpeechPaused);
                    if (isSpeechPaused) {
                      window.speechSynthesis.pause();
                    } else {
                      window.speechSynthesis.resume();
                    }
                  } else if (isSpeechPaused) {
                    setIsSpeechPaused(false);
                  }
                }} 
                className={`p-3 rounded-xl transition-all duration-300 ${
                  isSpeaking 
                    ? (isSpeechPaused ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white') 
                    : 'bg-gray-100 text-gray-400'
                }`}
                title="Pause/Resume Speech"
              >
                {isSpeaking ? (
                  isSpeechPaused ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2A1 1 0 0012 11V8a1 1 0 00-1.445-.832l-3 2z" clipRule="evenodd" />
                    </svg>
                  )
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2A1 1 0 0012 11V8a1 1 0 00-1.445-.832l-3 2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            )}
            
            <button 
              onClick={handleSend} 
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {!isOpen ? (
        <button 
          onClick={toggleChat} 
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      ) : (
        <div className={`absolute bottom-20 right-0 ${isOpen ? 'block' : 'hidden'}`}>
          {chatWindow}
        </div>
      )}
    </div>
  );
};

export default Chatbot;
