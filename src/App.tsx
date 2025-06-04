import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi! I'm FAQ Bot. Ask me anything about the university!",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      text: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: input }),
      });

      const data = await response.json();
      
      const botMessage: Message = {
        text: data.answer,
        isBot: true,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        text: "Sorry, I'm having trouble connecting to the server. Please try again later.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto max-w-4xl h-screen p-4 flex flex-col">
        <header className="text-center py-6">
          <h1 className="text-3xl font-bold mb-2 text-blue-400">University FAQ Bot</h1>
          <p className="text-gray-400">Ask me anything about campus life, courses, or facilities!</p>
        </header>

        <div className="flex-1 bg-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start space-x-2 ${
                  message.isBot ? '' : 'flex-row-reverse space-x-reverse'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.isBot ? 'bg-blue-500' : 'bg-green-500'
                  }`}
                >
                  {message.isBot ? (
                    <Bot size={20} />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isBot
                      ? 'bg-gray-700'
                      : 'bg-blue-600'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs text-gray-400 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-4 border-t border-gray-700 bg-gray-800"
          >
            <div className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!input.trim() || isLoading}
              >
                <span>{isLoading ? 'Thinking...' : 'Send'}</span>
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;