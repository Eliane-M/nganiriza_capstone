import React, { useState } from 'react';
import { Calendar, Clock, User, FileText, CheckCircle, XCircle, CalendarClock } from 'lucide-react';
import '../css/components/appointments_table.css';
import apiClient from '../../utils/apiClient';

const SpecialistAppointmentsTable = ({ appointments, loading, patientName, onRefresh }) => {
  const [processing, setProcessing] = useState(null);
  const [rescheduleForm, setRescheduleForm] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: '#f59e0b', bg: '#fef3c7', label: 'Pending' },
      confirmed: { color: '#10b981', bg: '#d1fae5', label: 'Confirmed' },
      cancelled: { color: '#ef4444', bg: '#fee2e2', label: 'Cancelled' },
      completed: { color: '#6b7280', bg: '#f3f4f6', label: 'Completed' }
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span 
        className="status-badge"
        style={{ backgroundColor: config.bg, color: config.color }}
      >
        {config.label}
      </span>
    );
  };

  const handleAccept = async (appointmentId) => {
    try {
      setProcessing(appointmentId);
      setFeedback(null);
      await apiClient.patch(`/api/specialists/appointments/${appointmentId}/status/`, {
        status: 'confirmed'
      });
      if (onRefresh) onRefresh();
      setFeedback({ type: 'success', text: 'Appointment confirmed successfully!' });
    } catch (error) {
      console.error('Failed to accept appointment:', error);
      setFeedback({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to accept appointment. Please try again.' 
      });
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (appointmentId) => {
    try {
      setProcessing(appointmentId);
      setFeedback(null);
      await apiClient.patch(`/api/specialists/appointments/${appointmentId}/status/`, {
        status: 'cancelled',
        cancellation_reason: 'Cancelled by specialist'
      });
      if (onRefresh) onRefresh();
      setFeedback({ type: 'success', text: 'Appointment cancelled successfully!' });
    } catch (error) {
      console.error('Failed to reject appointment:', error);
      setFeedback({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to cancel appointment. Please try again.' 
      });
    } finally {
      setProcessing(null);
    }
  };

  const handleReschedule = async (appointmentId, formData) => {
    try {
      setProcessing(appointmentId);
      setFeedback(null);
      await apiClient.post(`/api/specialists/appointments/${appointmentId}/reschedule/`, {
        appointment_date: formData.date,
        appointment_time: formData.time,
        notes: formData.notes || ''
      });
      setRescheduleForm(null);
      if (onRefresh) onRefresh();
      setFeedback({ type: 'success', text: 'Appointment rescheduled successfully! Patient will be notified.' });
    } catch (error) {
      console.error('Failed to reschedule appointment:', error);
      setFeedback({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to reschedule appointment. Please try again.' 
      });
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="appointments-loading">
        <div className="loading-spinner">Loading appointments...</div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="appointments-empty">
        <Calendar size={48} className="empty-icon" />
        <p>No appointments for this patient</p>
      </div>
    );
  }

  return (
    <div className="specialist-appointments-table">
      {feedback && (
        <div className={`appointment-feedback ${feedback.type}`}>
          {feedback.text}
        </div>
      )}
      
      <div className="appointments-list">
        {appointments.map((apt) => (
          <div key={apt.id} className="appointment-card">
            <div className="appointment-main-info">
              <div className="appointment-date-time">
                <div className="date-info">
                  <Calendar size={18} />
                  <span>{formatDate(apt.appointment_date || apt.date)}</span>
                </div>
                <div className="time-info">
                  <Clock size={18} />
                  <span>{formatTime(apt.appointment_time || apt.time)}</span>
                </div>
              </div>
              
              <div className="appointment-status">
                {getStatusBadge(apt.status)}
              </div>
            </div>

            {apt.notes && (
              <div className="appointment-notes">
                <FileText size={16} />
                <span>{apt.notes}</span>
              </div>
            )}

            <div className="appointment-actions">
              {apt.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleAccept(apt.id)}
                    disabled={processing === apt.id}
                    className="action-btn accept-btn"
                  >
                    <CheckCircle size={18} />
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(apt.id)}
                    disabled={processing === apt.id}
                    className="action-btn reject-btn"
                  >
                    <XCircle size={18} />
                    Reject
                  </button>
                </>
              )}
              
              {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                <button
                  onClick={() => setRescheduleForm({ appointmentId: apt.id, date: apt.appointment_date || '', time: apt.appointment_time || '' })}
                  disabled={processing === apt.id}
                  className="action-btn reschedule-btn"
                >
                  <CalendarClock size={18} />
                  Reschedule
                </button>
              )}
            </div>

            {rescheduleForm && rescheduleForm.appointmentId === apt.id && (
              <div className="reschedule-form">
                <h4>Reschedule Appointment</h4>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleReschedule(apt.id, rescheduleForm);
                }}>
                  <div className="form-row">
                    <label>
                      New Date
                      <input
                        type="date"
                        value={rescheduleForm.date}
                        onChange={(e) => setRescheduleForm({ ...rescheduleForm, date: e.target.value })}
                        required
                      />
                    </label>
                    <label>
                      New Time
                      <input
                        type="time"
                        value={rescheduleForm.time}
                        onChange={(e) => setRescheduleForm({ ...rescheduleForm, time: e.target.value })}
                        required
                      />
                    </label>
                  </div>
                  <label>
                    Notes (optional)
                    <textarea
                      value={rescheduleForm.notes || ''}
                      onChange={(e) => setRescheduleForm({ ...rescheduleForm, notes: e.target.value })}
                      placeholder="Reason for rescheduling..."
                      rows="2"
                    />
                  </label>
                  <div className="form-actions">
                    <button type="submit" disabled={processing === apt.id} className="submit-btn">
                      Confirm Reschedule
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setRescheduleForm(null)}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecialistAppointmentsTable;

