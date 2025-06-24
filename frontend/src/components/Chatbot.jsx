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

    // If speech is paused, clear the queue and stop speaking
    if (isSpeechPaused) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Clean up the text by removing markdown characters
    const cleanedMessage = message
      .replace(/\*\s+/g, '') // Remove bullet points (* )
      .replace(/`/g, '') // Remove backticks
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanedMessage);
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // Speed of speech (0.1 to 10)
    utterance.pitch = 1; // Pitch (0 to 2)
    utterance.volume = 1; // Volume (0 to 1)

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
      // Get the user's original question
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
    <div className={`fixed ${isFullScreen ? 'inset-0' : 'bottom-20 right-0 w-80 h-96'} z-50 bg-white flex flex-col transition-all duration-300`}>
      <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">AI Learning Assistant</h3>
        <div className="flex items-center space-x-2">
          <button onClick={toggleFullScreen} className="text-gray-500 hover:text-gray-800 p-1">
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
          <button onClick={toggleChat} className="text-gray-500 hover:text-gray-800 p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`my-2 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-lg px-3 py-2 ${isFullScreen ? 'max-w-md' : 'max-w-xs'} ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              {msg.sender === 'bot' ? (
                <div className="space-y-2">
                  <div className="prose prose-sm">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                  {msg.suggestions && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {msg.suggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          onClick={() => handleSuggestion(suggestion.id)}
                          className="px-3 py-1 text-sm rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                        >
                          {suggestion.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="my-2 flex justify-start">
            <div className='bg-gray-200 text-gray-800 rounded-lg px-3 py-2'>
              <div className='flex items-center space-x-1'>
                <span className='h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]'></span>
                <span className='h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]'></span>
                <span className='h-2 w-2 bg-gray-500 rounded-full animate-bounce'></span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <div className="flex space-x-2 flex-wrap justify-end">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            className="flex-1 rounded-l-lg p-2 border-t border-b border-l text-gray-800 border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
          />
          <button onClick={handleVoiceInput} className={`px-3 bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors ${isListening ? 'text-red-500' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-14 0m7 7v3m0 0H9m4 0h2M5 11a7 7 0 0114 0v3a1 1 0 01-1 1H6a1 1 0 01-1-1v-3z" />
            </svg>
          </button>
          <button onClick={handleSpeechToggle} className={`px-3 bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors ${isSpeechEnabled ? 'text-blue-500' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0v-7m0 0V5a2 2 0 012-2h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V19m-6 0a7 7 0 01-7-7m0 0v7m0 0V5a2 2 0 012-2h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V19z" />
            </svg>
          </button>
          {isSpeechEnabled && (
            <button onClick={() => {
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
            className={`px-3 bg-gray-200 hover:bg-gray-300 transition-colors ${isSpeaking ? (isSpeechPaused ? 'text-yellow-500' : 'text-green-500') : 'text-gray-400'} flex items-center justify-center`}
            title="Pause/Resume Speech">
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
          <button onClick={handleSend} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-r-lg border-blue-600 border hover:bg-blue-700 transition-colors">Send</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {!isOpen ? (
        <button onClick={toggleChat} className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      ) : (
        <div className={`absolute bottom-20 right-0 w-80 rounded-lg shadow-xl border border-gray-200 ${isOpen ? 'block' : 'hidden'}`}>
          {chatWindow}
        </div>
      )}
    </div>
  );
};

export default Chatbot;
