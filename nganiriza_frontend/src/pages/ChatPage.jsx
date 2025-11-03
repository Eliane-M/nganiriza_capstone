import React, { useEffect, useState, useRef, useContext } from 'react';
import { ChatBubble } from '../assets/components/ChatBubble.tsx';
import { Send as SendIcon } from 'lucide-react';
import { LanguageContext } from '../assets/components/context/LanguageContext.tsx';
import '../assets/css/chat/chat_page.css';

export function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: {
        en: "Hi! I'm your AI health companion. I'm here to provide accurate, supportive information about women's health and development. What would you like to know about today?",
        fr: "Salut ! Je suis votre compagnon de santé IA. Je suis ici pour fournir des informations précises et utiles sur la santé et le développement des femmes. Que souhaitez-vous savoir aujourd'hui ?",
        rw: "Muraho! Ndi umukunzi wawe w'ubuzima wa AI. Ndi hano gutanga amakuru akomeye kandi afasha ku buzima n'iterambere ry'abagore. Wifuza kumenya iki uyu munsi?"
      },
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const { language } = useContext(LanguageContext);

  const translations = {
    placeholder: {
      en: 'Ask me anything about women\'s health...',
      fr: 'Demandez-moi n\'importe quoi sur la santé des femmes...',
      rw: 'Mbaze ikintu cyose ku buzima bw\'abagore...'
    },
    quickQuestions: {
      en: 'Quick questions to get started:',
      fr: 'Questions rapides pour commencer :',
      rw: 'Ibibazo byihuse kugirango utangire:'
    },
    disclaimer: {
      en: 'Remember: This AI provides general information only. For medical concerns, please consult a healthcare professional.',
      fr: 'N\'oubliez pas : cette IA fournit des informations générales uniquement. Pour les problèmes médicaux, veuillez consulter un professionnel de la santé.',
      rw: 'Wibuke: Iyi AI itanga amakuru rusange gusa. Ku bibazo by\'ubuvuzi, nyamuneka ganiriza n\'umwuga w\'ubuzima.'
    },
    suggestions: {
      en: [
        'What changes should I expect during puberty?',
        'How do I know if my period is normal?',
        'What is reproductive health?'
      ],
      fr: [
        'Quels changements dois-je attendre pendant la puberté ?',
        'Comment savoir si mes règles sont normales ?',
        'Qu\'est-ce que la santé reproductive ?'
      ],
      rw: [
        'Ni izihe mpinduka nagomba gutegereza mu gihe cy\'ubwangavu?',
        'Nzi nte niba igihe cyanjye cy\'ukwezi ari normal?',
        'Ubuzima bw\'imyororokere ni iki?'
      ]
    },
    aiResponse: {
      en: 'Thank you for your question. This is a simulated response. In the actual application, this would be an AI-generated answer based on your specific question about women\'s health.',
      fr: "Merci pour votre question. Ceci est une réponse simulée. Dans l'application réelle, ce serait une réponse générée par l'IA en fonction de votre question spécifique sur la santé des femmes.",
      rw: "Urakoze kubaza ikibazo cyawe. Iyi ni inyunganizi y'igerageza. Mu gusohoka kwa nyuma, bizaba ari igisubizo cyakozwe na AI gishingiye ku kibazo cyawe kijyanye n'ubuzima bw'abagore."
    }
  };

  useEffect(() => { 
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); 
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim() === '') return;

    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    setTimeout(() => {
      const aiMessage = {
        id: messages.length + 2,
        text: translations.aiResponse[language],
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 600);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputText(suggestion);
  };

  return (
    <div className="chat_page">
      <div className="chat-container">
        <div className="messages-area">
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={typeof message.text === 'object' ? message.text[language] : message.text}
              isUser={message.isUser}
              timestamp={message.timestamp}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-section">
          {messages.length === 1 && (
            <div className="quick-questions">
              <p className="quick-questions-label">{translations.quickQuestions[language]}</p>
              <div className="suggestions">
                {translations.suggestions[language].map((suggestion, index) => (
                  <button
                    key={index}
                    className="suggestion-pill"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="input-wrapper">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={translations.placeholder[language]}
              className="message-input"
            />
            <button 
              onClick={handleSend} 
              className="send-button" 
              aria-label="Send message"
              disabled={!inputText.trim()}
            >
              <SendIcon size={20} />
            </button>
          </div>

          <p className="disclaimer-text">{translations.disclaimer[language]}</p>
        </div>
      </div>

      <button className="talk-with-us-fab">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span>Talk with Us</span>
      </button>
    </div>
  );
}