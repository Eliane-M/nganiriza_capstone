import React, { useState } from 'react';
import { User, MessageSquare, Send } from 'lucide-react';
import '../css/components/message_thread.css';
import apiClient from '../../utils/apiClient';

const MessageThread = ({ messages, loading, specialistName, specialistId, onMessageSent }) => {
  const [messageForm, setMessageForm] = useState({ subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleChange = (e) => {
    setMessageForm({
      ...messageForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!messageForm.subject.trim() || !messageForm.message.trim()) {
      setFeedback({ type: 'error', text: 'Please fill in both subject and message' });
      return;
    }

    try {
      setSending(true);
      setFeedback(null);
      const response = await apiClient.post('/api/specialists/messages/create/', {
        specialist: specialistId,
        subject: messageForm.subject,
        message: messageForm.message
      });
      
      setMessageForm({ subject: '', message: '' });
      setFeedback({ type: 'success', text: 'Message sent successfully!' });
      
      // Reload messages if callback provided
      if (onMessageSent) {
        onMessageSent();
      }
    } catch (error) {
      console.error('Failed to send message', error);
      setFeedback({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to send message. Please try again.' 
      });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="message-thread-loading">
        <div className="loading-spinner">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="message-thread-container">
      <div className="message-thread">
        {messages.length === 0 ? (
          <div className="message-thread-empty">
            <MessageSquare size={48} className="empty-icon" />
            <p>No messages yet</p>
            <span>Start a conversation with {specialistName}</span>
          </div>
        ) : (
          messages.map((message) => {
            const isFromUser = message.user_info && message.user_info.id;
            return (
              <div
                key={message.id}
                className={`message-thread-item ${isFromUser ? 'sent' : 'received'}`}
              >
                <div className="message-thread-avatar">
                  {isFromUser ? (
                    <User size={16} />
                  ) : (
                    <span>{specialistName?.charAt(0) || 'S'}</span>
                  )}
                </div>
                <div className="message-thread-content">
                  <div className="message-thread-header">
                    <span className="message-sender">
                      {isFromUser 
                        ? message.user_info?.name || 'You'
                        : specialistName}
                    </span>
                    <span className="message-time">
                      {new Date(message.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="message-thread-subject">{message.subject}</div>
                  <div className="message-thread-body">{message.message}</div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Message Form */}
      <form className="message-thread-form" onSubmit={handleSubmit}>
        {feedback && (
          <div className={`message-feedback ${feedback.type}`}>
            {feedback.text}
          </div>
        )}
        <div className="message-form-row">
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={messageForm.subject}
            onChange={handleChange}
            required
            className="message-subject-input"
          />
        </div>
        <div className="message-form-row">
          <textarea
            name="message"
            placeholder="Type your message..."
            value={messageForm.message}
            onChange={handleChange}
            rows="3"
            required
            className="message-text-input"
          />
        </div>
        <button type="submit" disabled={sending} className="message-send-btn">
          <Send size={18} />
          {sending ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default MessageThread;

