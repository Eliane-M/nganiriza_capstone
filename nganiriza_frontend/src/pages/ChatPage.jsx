import React, { useEffect, useState, useRef, useContext } from 'react';
import { Send as SendIcon, Home, MessageCircle, Users, MapPin, ArrowLeft } from 'lucide-react';
import { LanguageContext } from '../assets/components/context/LanguageContext.tsx';
import { useNavigate } from 'react-router-dom';
import Navbar from '../assets/components/Navbar';
import '../assets/css/chat/chat_page.css';

export function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: {
        en: "Hi! I'm your AI health companion. What would you like to know about women's health today?",
        fr: "Salut ! Je suis votre compagnon IA. Que souhaitez-vous savoir sur la santé des femmes ?",
        rw: "Muraho! Ndi umujyanama wawe wa AI. Wifuza kumenya iki ku buzima bw'abagore uyu munsi?"
      },
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();

  const translations = {
    placeholder: { en: "Type a message...", fr: "Écrivez un message...", rw: "Andika ubutumwa..." },
    typing: { en: "AI is typing...", fr: "L'IA écrit...", rw: "AI iri kwandika..." },
    back: { en: "Back", fr: "Retour", rw: "Subira inyuma" }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function askAI(query) {
    try {
      const res = await fetch('/api/ai/query/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, use_cache: true, language })
      });
      const data = await res.json();
      return data.success ? data.response : "Sorry, I couldn't respond right now.";
    } catch {
      return translations.typing[language].replace('typing', 'connect');
    }
  }

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMsg = {
      id: Date.now(),
      text: inputText,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    const typing = { id: 'typing', isUser: false, isTyping: true };
    setMessages(prev => [...prev, typing]);

    const reply = await askAI(userMsg.text);

    setMessages(prev => prev.filter(m => m.id !== 'typing').concat({
      id: Date.now() + 1,
      text: reply,
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

    setIsLoading(false);
  };

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: MessageCircle, label: "Chat", path: "/chat", active: true },
    { icon: Users, label: "Community", path: "/community" },
    { icon: MapPin, label: "Map", path: "/map" }
  ];

  return (
    <div className="chat_page mobile-app">
      <Navbar />
      {/* Mobile Header */}
      <div className="mobile-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          <ArrowLeft size={24} />
        </button>
        <div className="header-title">
          <div className="avatar-small">AI</div>
          <div>
            <h3>AI Health Companion</h3>
            <span className="online">Online</span>
          </div>
        </div>
      </div>

      <div className="chat-container">
        <div className="messages-area">
          {messages.map(msg => (
            <div key={msg.id} className={`chat-message ${msg.isUser ? 'user' : 'assistant'} ${msg.isTyping ? 'typing' : ''}`}>
              {!msg.isUser && !msg.isTyping && (
                <div className="avatar">
                  <div className="avatar-img">AI</div>
                </div>
              )}

              <div className="message-content">
                {msg.isTyping ? (
                  <div className="typing-bubble">
                    <span></span><span></span><span></span>
                  </div>
                ) : (
                  <div className="bubble">
                    <p>{typeof msg.text === 'object' ? msg.text[language] : msg.text}</p>
                    <span className="time">{msg.timestamp}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-section">
          <div className="input-bar">
            <input
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder={translations.placeholder[language]}
              disabled={isLoading}
            />
            <button onClick={handleSend} disabled={!inputText.trim() || isLoading}>
              {isLoading ? <div className="send-spinner"></div> : <SendIcon size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bottom-nav">
        {navItems.map((item, i) => (
          <button
            key={i}
            onClick={() => navigate(item.path)}
            className={`nav-item ${item.active ? 'active' : ''}`}
          >
            <item.icon size={24} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}