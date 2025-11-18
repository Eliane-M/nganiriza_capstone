import React, { useState } from 'react';
import { User, MessageSquare, Send } from 'lucide-react';
import '../css/components/message_thread.css';
import apiClient from '../../utils/apiClient';

const SpecialistMessageThread = ({ messages, loading, patientName, patientId, onMessageSent }) => {
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
    if (!messageForm.message.trim()) {
      setFeedback({ type: 'error', text: 'Please enter a message' });
      return;
    }

    try {
      setSending(true);
      setFeedback(null);
      
      // Specialist replying to patient - use user ID and set subject as follow-up
      const subject = messageForm.subject.trim() || `Re: Follow-up - ${new Date().toLocaleDateString()}`;
      
      const response = await apiClient.post('/api/specialists/messages/create/', {
        user: patientId,
        subject: subject,
        message: messageForm.message
      });
      
      setMessageForm({ subject: '', message: '' });
      setFeedback({ type: 'success', text: 'Message sent successfully!' });
      
      // Reload messages if callback provided
      if (onMessageSent) {
        setTimeout(() => {
          onMessageSent();
        }, 500);
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
            <span>Start a conversation with {patientName}</span>
          </div>
        ) : (
          messages.map((message, index) => {
            // For now, we'll assume messages alternate or use a simple heuristic:
            // If it's the first message, it's from the patient
            // Otherwise, we check if the subject starts with "Re:" to indicate a reply
            // This is a simplified approach - in a production system, you'd want a proper sender field
            const isReply = message.subject?.toLowerCase().startsWith('re:') || message.subject?.toLowerCase().includes('follow-up');
            const isFromPatient = index === 0 || !isReply;
            
            return (
              <div
                key={message.id}
                className={`message-thread-item ${isFromPatient ? 'received' : 'sent'}`}
              >
                <div className="message-thread-avatar">
                  {isFromPatient ? (
                    <span>{patientName?.charAt(0) || 'P'}</span>
                  ) : (
                    <User size={16} />
                  )}
                </div>
                <div className="message-thread-content">
                  <div className="message-thread-header">
                    <span className="message-sender">
                      {isFromPatient 
                        ? patientName || 'Patient'
                        : 'You'}
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

      {/* Reply Form */}
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
            placeholder="Subject (optional - will auto-generate if empty)"
            value={messageForm.subject}
            onChange={handleChange}
            className="message-subject-input"
          />
        </div>
        <div className="message-form-row">
          <textarea
            name="message"
            placeholder="Type your response..."
            value={messageForm.message}
            onChange={handleChange}
            rows="4"
            required
            className="message-text-input"
          />
        </div>
        <button type="submit" disabled={sending} className="message-send-btn">
          <Send size={18} />
          {sending ? 'Sending...' : 'Send Response'}
        </button>
      </form>
    </div>
  );
};

export default SpecialistMessageThread;

