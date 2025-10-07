import React, { useEffect, useState, useRef, useContext } from 'react';
import { ChatBubble } from '../components/ChatBubble';
import { SendIcon } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';

export function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: {
        en: "Hello! I'm Nganiriza. You can ask me any questions about sexual and reproductive health. Your questions are private and confidential.",
        fr: "Bonjour ! Je suis Nganiriza. Vous pouvez me poser toutes vos questions sur la santé sexuelle et reproductive. Vos questions sont privées et confidentielles.",
        rw: "Muraho! Ndi Nganiriza. Ushobora kumbaza ibibazo byose bijyanye n'ubuzima bw'imyororokere. Ibibazo byawe ni ibanga kandi birinzwe."
      },
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  ]);

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language } = useContext(LanguageContext);

  const translations = {
    placeholder: {
      en: 'Type your question...',
      fr: 'Tapez votre question...',
      rw: 'Andika ikibazo cyawe...'
    },
    title: {
      en: 'Chat with Nganiriza',
      fr: 'Discuter avec Nganiriza',
      rw: 'Kuganira na Nganiriza'
    },
    privateNotice: {
      en: 'Your conversations are private and confidential',
      fr: 'Vos conversations sont privées et confidentielles',
      rw: 'Ikiganiro cyawe kirihariye kandi ni ibanga'
    },
    aiResponse: {
      en: 'Thank you for your question. This is a simulated response. In the actual application, this would be an AI-generated answer based on your specific question about sexual and reproductive health.',
      fr: "Merci pour votre question. Ceci est une réponse simulée. Dans l'application réelle, ce serait une réponse générée par l'IA en fonction de votre question spécifique sur la santé sexuelle et reproductive.",
      rw: 'Urakoze kubaza ikibazo cyawe. Iyi ni inyunganizi y\'igerageza. Mu gusohoka kwa nyuma, bizaba ari igisubizo cyakozwe na AI gishingiye ku kibazo cyawe kijyanye n’ubuzima bw’imyororokere.'
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (inputText.trim() === '') return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: messages.length + 2,
        text: translations.aiResponse[language as keyof typeof translations.aiResponse],
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-purple-600 text-white p-4 flex items-center">
        <h1 className="text-xl font-semibold mx-auto">
          {translations.title[language as keyof typeof translations.title]}
        </h1>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-purple-50">
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={
              typeof message.text === 'object'
                ? message.text[language as keyof typeof message.text]
                : message.text
            }
            isUser={message.isUser}
            timestamp={message.timestamp}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={translations.placeholder[language as keyof typeof translations.placeholder]}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleSend}
            className="ml-2 bg-purple-600 text-white rounded-full p-2 focus:outline-none hover:bg-purple-700"
          >
            <SendIcon size={20} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          {translations.privateNotice[language as keyof typeof translations.privateNotice]}
        </p>
      </div>
    </div>
  );
}
