import React, { useEffect, useState, useRef, useContext } from 'react';
import { Send as SendIcon, Home, MessageCircle, Users, MapPin, ArrowLeft, Menu, Plus, User, BookOpen } from 'lucide-react';
import { LanguageContext } from '../contexts/AppContext';
import { useTranslation } from '../utils/translations';
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
  // Load conversation ID from localStorage on mount
  const [currentConversationId, setCurrentConversationId] = useState(() => {
    try {
      return localStorage.getItem('currentConversationId') || null;
    } catch (e) {
      return null;
    }
  });
  const [loadingConversations, setLoadingConversations] = useState(false);
  const messagesEndRef = useRef(null);
  const { language } = useContext(LanguageContext);
  const { t } = useTranslation(language);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // Save conversation ID to localStorage whenever it changes
  useEffect(() => {
    if (currentConversationId) {
      try {
        localStorage.setItem('currentConversationId', currentConversationId);
      } catch (e) {
        console.error('Failed to save conversation ID to localStorage:', e);
      }
    } else {
      try {
        localStorage.removeItem('currentConversationId');
      } catch (e) {
        console.error('Failed to remove conversation ID from localStorage:', e);
      }
    }
  }, [currentConversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isAuthenticated) {
      loadConversations();
      
      // If we have a saved conversation ID, load its messages after conversations are loaded
      const savedConversationId = localStorage.getItem('currentConversationId');
      if (savedConversationId) {
        // Small delay to ensure loadConversations completes first
        setTimeout(() => {
          loadConversation(savedConversationId);
        }, 100);
      }
    }
  }, [isAuthenticated]);

  const loadConversations = async () => {
    if (!isAuthenticated) return;
    try {
      setLoadingConversations(true);
      const response = await apiClient.get('/api/dashboard/');
      // Handle both array response and paginated response
      let conversationsList = [];
      if (Array.isArray(response.data)) {
        conversationsList = response.data;
      } else if (response.data.results && Array.isArray(response.data.results)) {
        conversationsList = response.data.results;
      } else if (response.data && typeof response.data === 'object') {
        // If it's a single object, wrap it in an array
        conversationsList = [response.data];
      }
      
      // Deduplicate conversations by ID and filter out invalid ones
      const seenIds = new Set();
      const uniqueConversations = conversationsList.filter(conv => {
        const convId = conv.id || conv.id_number;
        if (!convId || seenIds.has(convId)) {
          return false;
        }
        seenIds.add(convId);
        return true;
      });
      
      setConversations(uniqueConversations);
    } catch (error) {
      console.error('Failed to load conversations', error);
      setConversations([]);
    } finally {
      setLoadingConversations(false);
    }
  };

  const createNewConversation = async () => {
    if (!isAuthenticated) return;
    try {
      // Clear current conversation ID
      setCurrentConversationId(null);
      
      // Reset messages to welcome message
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
    if (!isAuthenticated || !conversationId) {
      console.error('Cannot load conversation: not authenticated or no conversationId');
      return;
    }
    try {
      setCurrentConversationId(conversationId);
      const response = await apiClient.get(`/api/dashboard/conversations/${conversationId}/messages/`);
      
      // Handle both array and object responses
      let messagesData = [];
      if (Array.isArray(response.data)) {
        messagesData = response.data;
      } else if (response.data && typeof response.data === 'object') {
        messagesData = [response.data];
      }
      
      const loadedMessages = messagesData.map(msg => ({
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
      // Reset to empty state on error
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
    }
  };

  async function askAI(query, conversationId = null) {
    try {
      const res = await apiClient.post('/api/ai/query/', {
        query, 
        use_cache: true, 
        language,
        conversation_id: conversationId
      });
      return res.data.success ? res.data.response : "Sorry, I couldn't respond right now.";
    } catch (error) {
      console.error('AI query error:', error);
      return t('chat.typing').replace('typing', 'connect');
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
        conversationId = convResponse?.data?.id_number || convResponse?.data?.id;
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

    // Unified API call - this will handle everything: save message, call Ollama, save reply, generate title
    try {
      const response = await apiClient.post('/api/ai/query/', {
        query: messageText,
        conversation_id: currentConversationId,
        language: language === 'rw' ? 'kin' : language === 'fr' ? 'fre' : 'eng',
        use_cache: true
      });
      
      let reply = null;
      let newConversationId = currentConversationId;
      
      if (response.data && response.data.success) {
        reply = response.data.response;
        
        // Update conversation ID if a new one was created
        if (response.data.conversation_id) {
          newConversationId = response.data.conversation_id;
          if (newConversationId !== currentConversationId) {
            setCurrentConversationId(newConversationId);
          }
        }
        
        // Reload conversations to get updated title
        if (isAuthenticated) {
          await loadConversations();
        }
      } else {
        reply = response.data?.error || "Sorry, I couldn't respond right now.";
      }
      
      // Remove typing indicator and add assistant reply
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== 'typing');
        if (reply) {
          return filtered.concat({
            id: Date.now() + 1,
            text: reply,
            isUser: false,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        }
        return filtered;
      });
    } catch (error) {
      console.error('Failed to send message', error);
      // Remove typing indicator
      setMessages(prev => prev.filter(m => m.id !== 'typing'));
      
      // Show error message
      setMessages(prev => prev.concat({
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting. Please try again.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
    }

    setIsLoading(false);
  };

  const navItems = [
    { icon: Home, label: t('nav.home'), path: "/" },
    { icon: MessageCircle, label: t('nav.chat'), path: "/chat", active: true },
    { icon: Users, label: t('nav.specialists'), path: "/specialists" },
    { icon: MapPin, label: t('nav.map'), path: "/map" },
    { icon: BookOpen, label: t('nav.learn'), path: "/learn" },
    { icon: User, label: t('nav.profile'), path: "/profile" }
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
          title={t('chat.chatHistory')}
        >
          <div className="chat-sidebar-content">
            <button onClick={createNewConversation} className="new-chat-btn">
              <Plus size={18} />
              <span>{t('chat.newChat')}</span>
            </button>
            
            <div className="conversations-list">
              {loadingConversations ? (
                <div className="loading-text">Loading...</div>
              ) : conversations.length === 0 ? (
                <div className="empty-conversations">{t('chat.noConversations')}</div>
              ) : (
                conversations.map((conv) => {
                  const convId = conv.id || conv.id_number;
                  if (!convId) {
                    console.warn('Conversation missing ID:', conv);
                    return null;
                  }
                  return (
                    <button
                      key={convId}
                      onClick={() => loadConversation(convId)}
                      className={`conversation-item ${currentConversationId === convId ? 'active' : ''}`}
                    >
                      <div className="conversation-preview">
                        {conv.title || conv.first_message_preview || 'New conversation'}
                      </div>
                      <div className="conversation-time">
                        {conv.updated_at ? new Date(conv.updated_at).toLocaleDateString() : ''}
                      </div>
                    </button>
                  );
                }).filter(Boolean)
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
              <h3>{t('chat.aiCompanion')}</h3>
              <span className="online">{t('chat.online')}</span>
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
              placeholder={t('chat.placeholder')}
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