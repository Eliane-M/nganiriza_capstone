import React from 'react';
import { Calendar, Clock, User, FileText, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react';
import '../css/components/appointments_table.css';

const AppointmentsTable = ({ appointments, loading, specialistName }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={16} className="status-icon confirmed" />;
      case 'cancelled':
        return <XCircle size={16} className="status-icon cancelled" />;
      case 'completed':
        return <CheckCircle size={16} className="status-icon completed" />;
      default:
        return <ClockIcon size={16} className="status-icon pending" />;
    }
  };

  const getStatusClass = (status) => {
    return `status-badge status-${status}`;
  };

  if (loading) {
    return (
      <div className="appointments-table-loading">
        <div className="loading-spinner">Loading appointments...</div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="appointments-table-empty">
        <Calendar size={48} className="empty-icon" />
        <p>No appointments yet</p>
        <span>Book an appointment with {specialistName}</span>
      </div>
    );
  }

  return (
    <div className="appointments-table-container">
      <table className="appointments-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Specialist Name</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>
                <div className="table-cell-content">
                  <Calendar size={16} className="cell-icon" />
                  {new Date(appointment.appointment_date).toLocaleDateString()}
                </div>
              </td>
              <td>
                <div className="table-cell-content">
                  <Clock size={16} className="cell-icon" />
                  {new Date(`2000-01-01T${appointment.appointment_time}`).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </td>
              <td>
                <div className={`${getStatusClass(appointment.status)}`}>
                  {getStatusIcon(appointment.status)}
                  <span>{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</span>
                </div>
              </td>
              <td>
                <div className="table-cell-content">
                  <User size={16} className="cell-icon" />
                  {appointment.specialist_info?.name || specialistName || 'Specialist'}
                </div>
              </td>
              <td>
                <div className="table-cell-content notes-cell">
                  <FileText size={16} className="cell-icon" />
                  <span className="notes-text" title={appointment.notes || 'No notes'}>
                    {appointment.notes || 'No notes'}
                  </span>
                </div>
              </td>
              <td>
                <div className="table-actions">
                  {appointment.status === 'pending' && (
                    <button className="action-btn cancel-btn" title="Cancel appointment">
                      Cancel
                    </button>
                  )}
                  {appointment.status === 'confirmed' && (
                    <button className="action-btn view-btn" title="View details">
                      View
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentsTable;

