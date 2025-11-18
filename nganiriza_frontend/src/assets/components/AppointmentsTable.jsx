import React, { useState } from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle, Clock as ClockIcon, Eye, X } from 'lucide-react';
import '../css/components/appointments_table.css';
import apiClient from '../../utils/apiClient';
import AppointmentHistoryView from './AppointmentHistoryView';

const AppointmentsTable = ({ appointments, loading, specialistName }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
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

  const handleViewHistory = async (appointmentId) => {
    try {
      setLoadingHistory(true);
      const response = await apiClient.get(`/api/specialists/appointments/${appointmentId}/history/`);
      setHistoryData(response.data);
      setSelectedAppointment(appointmentId);
    } catch (error) {
      console.error('Failed to load appointment history:', error);
      alert('Failed to load appointment history. Please try again.');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleCloseHistory = () => {
    setSelectedAppointment(null);
    setHistoryData(null);
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

  if (selectedAppointment && historyData) {
    return (
      <AppointmentHistoryView
        appointment={historyData.appointment}
        history={historyData.history}
        onClose={handleCloseHistory}
        specialistName={specialistName}
      />
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
                <div className="table-actions">
                  <button 
                    className="action-btn view-btn" 
                    title="View appointment history"
                    onClick={() => handleViewHistory(appointment.id)}
                    disabled={loadingHistory}
                  >
                    <Eye size={16} />
                    {loadingHistory && selectedAppointment === appointment.id ? 'Loading...' : 'View'}
                  </button>
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

