import React, { useEffect, useState, useRef, useContext } from 'react';
import { Send as SendIcon, Home, MessageCircle, Users, MapPin, ArrowLeft, Menu, Plus } from 'lucide-react';
import { LanguageContext } from '../assets/components/context/LanguageContext.tsx';
import { useNavigate } from 'react-router-dom';
import Navbar from '../assets/components/Navbar';
import Sidebar from '../assets/components/Sidebar';
import apiClient from '../utils/apiClient';
import { AuthContext } from '../assets/components/context/AuthContext';
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
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default to open
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const messagesEndRef = useRef(null);
  const { language } = useContext(LanguageContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const translations = {
    placeholder: { en: "Type a message...", fr: "Écrivez un message...", rw: "Andika ubutumwa..." },
    typing: { en: "AI is typing...", fr: "L'IA écrit...", rw: "AI iri kwandika..." },
    back: { en: "Back", fr: "Retour", rw: "Subira inyuma" },
    newChat: { en: "New Chat", fr: "Nouvelle conversation", rw: "Inkuru nshya" },
    chatHistory: { en: "Chat History", fr: "Historique", rw: "Amateka" },
    noConversations: { en: "No conversations yet", fr: "Aucune conversation", rw: "Nta nkuru" }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isAuthenticated) {
      loadConversations();
    }
  }, [isAuthenticated]);

  const loadConversations = async () => {
    if (!isAuthenticated) return;
    try {
      setLoadingConversations(true);
      const response = await apiClient.get('/api/dashboard/');
      setConversations(response.data.results || []);
    } catch (error) {
      console.error('Failed to load conversations', error);
    } finally {
      setLoadingConversations(false);
    }
  };

  const createNewConversation = async () => {
    if (!isAuthenticated) return;
    try {
      const response = await apiClient.post('/api/dashboard/conversations/', {
        title: '',
        language: language === 'rw' ? 'kin' : language === 'fr' ? 'fre' : 'eng',
        channel: 'web'
      });
      setCurrentConversationId(response.data.id);
      setMessages([{
        id: 1,
        text: {
          en: "Hi! I'm your AI health companion. What would you like to know about women's health today?",
          fr: "Salut ! Je suis votre compagnon IA. Que souhaitez-vous savoir sur la santé des femmes ?",
          rw: "Muraho! Ndi umujyanama wawe wa AI. Wifuza kumenya iki ku buzima bw'abagore uyu munsi?"
        },
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      await loadConversations();
      setSidebarOpen(false);
    } catch (error) {
      console.error('Failed to create conversation', error);
    }
  };

  const loadConversation = async (conversationId) => {
    if (!isAuthenticated) return;
    try {
      setCurrentConversationId(conversationId);
      const response = await apiClient.get(`/api/dashboard/conversations/${conversationId}/messages/`);
      const loadedMessages = response.data.map(msg => ({
        id: msg.id_number || msg.id,
        text: msg.content,
        isUser: msg.role === 'user',
        timestamp: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
      setMessages(loadedMessages.length > 0 ? loadedMessages : [{
        id: 1,
        text: {
          en: "Hi! I'm your AI health companion. What would you like to know about women's health today?",
          fr: "Salut ! Je suis votre compagnon IA. Que souhaitez-vous savoir sur la santé des femmes ?",
          rw: "Muraho! Ndi umujyanama wawe wa AI. Wifuza kumenya iki ku buzima bw'abagore uyu munsi?"
        },
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setSidebarOpen(false);
    } catch (error) {
      console.error('Failed to load conversation', error);
    }
  };

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
    const messageText = inputText;
    setInputText('');
    setIsLoading(true);

    // Create conversation if none exists and user is authenticated
    let conversationId = currentConversationId;
    if (isAuthenticated && !conversationId) {
      try {
        const convResponse = await apiClient.post('/api/dashboard/conversations/', {
          title: '',
          language: language === 'rw' ? 'kin' : language === 'fr' ? 'fre' : 'eng',
          channel: 'web'
        });
        conversationId = convResponse.data.id;
        setCurrentConversationId(conversationId);
      } catch (error) {
        console.error('Failed to create conversation', error);
      }
    }

    // Save user message to backend if authenticated
    if (isAuthenticated && conversationId) {
      try {
        await apiClient.post(`/api/dashboard/conversations/${conversationId}/messages/`, {
          role: 'user',
          content: messageText
        });
      } catch (error) {
        console.error('Failed to save message', error);
      }
    }

    const typing = { id: 'typing', isUser: false, isTyping: true };
    setMessages(prev => [...prev, typing]);

    const reply = await askAI(messageText);

    // Save assistant reply to backend if authenticated
    if (isAuthenticated && conversationId) {
      try {
        await apiClient.post(`/api/dashboard/conversations/${conversationId}/messages/`, {
          role: 'assistant',
          content: reply
        });
        await loadConversations();
      } catch (error) {
        console.error('Failed to save assistant message', error);
      }
    }

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
      
      <div className={`chat-layout ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          title={translations.chatHistory[language]}
        >
          <div className="chat-sidebar-content">
            <button onClick={createNewConversation} className="new-chat-btn">
              <Plus size={18} />
              <span>{translations.newChat[language]}</span>
            </button>
            
            <div className="conversations-list">
              {loadingConversations ? (
                <div className="loading-text">Loading...</div>
              ) : conversations.length === 0 ? (
                <div className="empty-conversations">{translations.noConversations[language]}</div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => loadConversation(conv.id)}
                    className={`conversation-item ${currentConversationId === conv.id ? 'active' : ''}`}
                  >
                    <div className="conversation-preview">
                      {conv.first_message_preview || 'New conversation'}
                    </div>
                    <div className="conversation-time">
                      {new Date(conv.updated_at).toLocaleDateString()}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </Sidebar>

        {/* Menu button when sidebar is closed on desktop */}
        {!sidebarOpen && (
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="sidebar-reopen-btn"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
        )}

        {/* Mobile Header */}
        <div className="mobile-header">
          <button onClick={() => setSidebarOpen(true)} className="menu-btn">
            <Menu size={24} />
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