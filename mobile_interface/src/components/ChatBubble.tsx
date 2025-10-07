import React from 'react';
interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp: string;
}
export function ChatBubble({
  message,
  isUser,
  timestamp
}: ChatBubbleProps) {
  return <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] rounded-lg px-4 py-2 ${isUser ? 'bg-purple-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow'}`}>
        <p className="text-sm">{message}</p>
        <p className={`text-xs mt-1 ${isUser ? 'text-purple-200' : 'text-gray-500'}`}>
          {timestamp}
        </p>
      </div>
    </div>;
}