import React from 'react';
import { X, Calendar, Clock, User, FileText, ArrowRight, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react';
import '../css/components/appointment_history.css';

const AppointmentHistoryView = ({ appointment, history, onClose, specialistName }) => {
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

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
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

  return (
    <div className="appointment-history-view">
      <div className="history-header">
        <div className="history-header-content">
          <h2>Appointment Details</h2>
          <button onClick={onClose} className="close-btn" aria-label="Close">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="history-content">
        {/* Current Appointment Info */}
        <div className="appointment-info-card">
          <h3>Current Appointment</h3>
          <div className="info-grid">
            <div className="info-item">
              <Calendar size={18} />
              <div>
                <span className="info-label">Date</span>
                <span className="info-value">{formatDate(appointment.appointment_date)}</span>
              </div>
            </div>
            <div className="info-item">
              <Clock size={18} />
              <div>
                <span className="info-label">Time</span>
                <span className="info-value">{formatTime(appointment.appointment_time)}</span>
              </div>
            </div>
            <div className="info-item">
              <User size={18} />
              <div>
                <span className="info-label">Specialist</span>
                <span className="info-value">{appointment.specialist_info?.name || specialistName || 'Specialist'}</span>
              </div>
            </div>
            <div className="info-item">
              <CheckCircle size={18} />
              <div>
                <span className="info-label">Status</span>
                <span className="info-value">{getStatusBadge(appointment.status)}</span>
              </div>
            </div>
          </div>
          {appointment.notes && (
            <div className="appointment-notes">
              <FileText size={16} />
              <div>
                <span className="notes-label">Notes</span>
                <p className="notes-text">{appointment.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* History Timeline */}
        {history && history.length > 0 ? (
          <div className="history-timeline">
            <h3>Appointment History</h3>
            <div className="timeline">
              {history.map((item, index) => (
                <div key={item.id} className="timeline-item">
                  <div className="timeline-marker" />
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <span className="action-type">{item.action_display}</span>
                      <span className="action-date">{formatDateTime(item.created_at)}</span>
                    </div>
                    <div className="action-details">
                      {item.action_type === 'rescheduled' && (
                        <div className="reschedule-details">
                          <div className="change-item">
                            <span className="change-label">Previous:</span>
                            <span className="change-value">
                              {formatDate(item.previous_date)} at {formatTime(item.previous_time)}
                            </span>
                          </div>
                          <ArrowRight size={16} className="arrow-icon" />
                          <div className="change-item">
                            <span className="change-label">New:</span>
                            <span className="change-value">
                              {formatDate(item.new_date)} at {formatTime(item.new_time)}
                            </span>
                          </div>
                        </div>
                      )}
                      {item.action_type === 'status_changed' && (
                        <div className="status-change-details">
                          <span className="change-label">Status changed from</span>
                          <span className="status-badge old-status">{item.previous_status}</span>
                          <ArrowRight size={16} className="arrow-icon" />
                          <span className="status-badge new-status">{item.new_status}</span>
                        </div>
                      )}
                      {item.notes && (
                        <div className="history-notes">
                          <FileText size={14} />
                          <span>{item.notes}</span>
                        </div>
                      )}
                      <div className="changed-by">
                        Changed by: {item.changed_by}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-history">
            <p>No history available for this appointment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentHistoryView;

