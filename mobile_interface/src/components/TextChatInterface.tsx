import React, { useEffect, useState, useRef } from 'react';
import { SendIcon, ArrowLeftIcon } from 'lucide-react';
interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: string;
}
interface TextChatInterfaceProps {
  specialist: {
    id: string;
    name: string;
    specialty: string;
    imageUrl: string;
  };
  onBack: () => void;
}
export function TextChatInterface({
  specialist,
  onBack
}: TextChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([{
    id: 1,
    text: `Hello, I'm ${specialist.name}, your ${specialist.specialty}. How can I help you today?`,
    isUser: false,
    timestamp: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  const handleSend = () => {
    if (inputText.trim() === '') return;
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputText,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    // Simulate specialist response
    setTimeout(() => {
      const specialistMessage = {
        id: Date.now() + 1,
        text: 'Thank you for sharing. I understand your concern. This is a simulated response from a healthcare specialist. In the actual app, you would receive personalized guidance based on your question.',
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      setMessages(prev => [...prev, specialistMessage]);
    }, 1500);
  };
  return <div className="flex flex-col h-full">
      <div className="bg-purple-600 text-white p-4 flex items-center">
        <button onClick={onBack} className="mr-2">
          <ArrowLeftIcon size={20} />
        </button>
        <div className="flex items-center">
          <img src={specialist.imageUrl} alt={specialist.name} className="w-8 h-8 rounded-full object-cover mr-2" />
          <div>
            <h1 className="text-base font-semibold">{specialist.name}</h1>
            <p className="text-xs opacity-80">{specialist.specialty}</p>
          </div>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto bg-purple-50">
        {messages.map(message => <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            {!message.isUser && <img src={specialist.imageUrl} alt={specialist.name} className="w-8 h-8 rounded-full object-cover mr-2 self-end" />}
            <div className={`max-w-[75%] rounded-lg px-4 py-2 ${message.isUser ? 'bg-purple-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow'}`}>
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${message.isUser ? 'text-purple-200' : 'text-gray-500'}`}>
                {message.timestamp}
              </p>
            </div>
          </div>)}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center">
          <input type="text" value={inputText} onChange={e => setInputText(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} placeholder="Type your message..." className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
          <button onClick={handleSend} className="ml-2 bg-purple-600 text-white rounded-full p-2 focus:outline-none hover:bg-purple-700">
            <SendIcon size={20} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Your conversations are private and confidential
        </p>
      </div>
    </div>;
}