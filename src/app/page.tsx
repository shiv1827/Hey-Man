'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';
import { Send, User } from 'lucide-react';
import { Message } from 'ai';
import AudioPlayer from './components/AudioPlayer';

const sampleQuestions = [
  "What's the weather like?",
  "Tell me a joke",
  "How does AI work?",
  "Write a poem"
] as const;

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/openai/chat',
  });
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  const handleQuestionClick = (question: string) => {
    setSelectedQuestion(question);
    const form = document.querySelector('form');
    if (form) {
      const input = form.querySelector('input');
      if (input) {
        input.value = question;
        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
      }
      form.dispatchEvent(new Event('submit', { bubbles: true }));
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50">
      <div className="flex w-full max-w-3xl flex-col h-screen p-4">
        <div className="flex-1 overflow-y-auto space-y-6 py-4">
          {messages.length === 0 && !error && (
            <div className="flex items-center justify-center h-full flex-col gap-2">
              <h1 className="text-4xl font-bold">Hey Man</h1>
              <p className="text-gray-500">How can I help you today?</p>
            </div>
          )}
          {error && (
            <div className="flex items-center justify-center h-full flex-col gap-2">
              <div className="bg-red-50 text-red-500 p-4 rounded-lg max-w-md">
                <h3 className="font-bold">Error</h3>
                <p>{error.message || 'An error occurred. Please try again.'}</p>
              </div>
            </div>
          )}
          {messages.map((message: Message, i: number) => (
            <div
              key={i}
              className={`flex items-start gap-3 px-4 py-3 ${
                message.role === 'assistant'
                  ? 'bg-white rounded-lg shadow-sm'
                  : ''
              }`}
            >
              <div className={`shrink-0 ${message.role === 'assistant' ? 'bg-green-100' : 'bg-blue-100'} w-8 h-8 rounded-full flex items-center justify-center`}>
                {message.role === 'assistant' ? (
                  <span className="text-green-700 text-sm font-medium">J</span>
                ) : (
                  <User className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-gray-800">
                    {message.role === 'assistant' ? 'Jimmy' : 'You'}
                  </span>
                  {message.role === 'assistant' && (
                    <AudioPlayer text={message.content} />
                  )}
                </div>
                <p className="text-gray-700 leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 px-4 py-3 bg-white rounded-lg shadow-sm">
              <div className="shrink-0 bg-green-100 w-8 h-8 rounded-full flex items-center justify-center">
                <span className="text-green-700 text-sm font-medium">J</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-sm text-gray-800">Jimmy</span>
                </div>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4">
          <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
            <input
              className="flex-1 p-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={input}
              placeholder="Message Jimmy..."
              onChange={handleInputChange}
            />
            <button
              type="submit"
              className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {sampleQuestions.map((question) => (
              <button
                key={question}
                onClick={() => handleQuestionClick(question)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors
                  ${selectedQuestion === question
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
