import React, {useState, useEffect} from 'react';
import '../../assets/css/specialists/specialistdashboard.scss';
import { Calendar, MessageCircle, Users, BarChart3, Plus, Phone, Video, MessageSquare } from 'lucide-react';
import BASE_URL from '../../config';
import axios from 'axios';

const SpecialistDashboard = () => {
  const [stats, setStats] = useState({
    today_appointments: 0,
    unread_messages: 0,
    active_patients: 0,
    week_appointments: 0
  });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [specialistName, setSpecialistName] = useState('Doctor');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('access_token');
    
    try {
      setLoading(true);
      const [statsRes, appointmentsRes, profileRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/specialists/dashboard/stats/`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${BASE_URL}/api/specialists/appointments/specialist/`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        // Fetch specialist profile if you have this endpoint
        axios.get(`${BASE_URL}/api/specialists/profile/`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: { name: 'Doctor' } })) // Fallback if endpoint doesn't exist
      ]);
      
      setStats(statsRes.data);
      setAppointments(appointmentsRes.data.results || appointmentsRes.data);
      setSpecialistName(profileRes.data.name || profileRes.data.user?.first_name || 'Doctor');
      setError(null);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#3b82f6',
      urgent: '#dc2626'
    };
    return colors[priority?.toLowerCase()] || '#6b7280';
  };

  const getTypeIcon = (type) => {
    const icons = {
      video: <Video size={16} />,
      phone: <Phone size={16} />,
      'in-person': <Users size={16} />,
      chat: <MessageSquare size={16} />
    };
    return icons[type?.toLowerCase()] || '📋';
  };

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

  const handleAccept = async (appointmentId) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.patch(
        `${BASE_URL}/api/specialists/appointments/${appointmentId}/`,
        { status: 'confirmed' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDashboardData(); // Refresh data
    } catch (err) {
      console.error('Failed to accept appointment:', err);
    }
  };

  const handleReschedule = (appointmentId) => {
    // Implement reschedule logic or navigate to reschedule page
    console.log('Reschedule appointment:', appointmentId);
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
          {error}
          <button onClick={fetchDashboardData} style={{ marginTop: '1rem', display: 'block', margin: '1rem auto' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div>
          <h1>Welcome back, Dr. {specialistName}</h1>
          <p>Manage your appointments and patient communications</p>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon today"><Calendar size={24} /></div>
          <div>
            <h3>Today's Appointments</h3>
            <p className="stat-number">{stats.today_appointments || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon messages"><MessageCircle size={24} /></div>
          <div>
            <h3>Unread Messages</h3>
            <p className="stat-number">{stats.unread_messages || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon patients"><Users size={24} /></div>
          <div>
            <h3>Active Patients</h3>
            <p className="stat-number">{stats.active_patients || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon week"><BarChart3 size={24} /></div>
          <div>
            <h3>This Week</h3>
            <p className="stat-number">{stats.week_appointments || 0}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className="tab active">Appointments</button>
        <button className="tab">Messages</button>
        <button className="tab">Patient Records</button>
      </div>

      {/* Upcoming Appointments */}
      <div className="appointments-section">
        <div className="section-header">
          <h2>Upcoming Appointments</h2>
          <button className="add-appointment-btn">
            <Plus size={20} />
            Add Appointment
          </button>
        </div>

        <div className="appointments-list">
          {appointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              No upcoming appointments
            </div>
          ) : (
            appointments.map((apt) => (
              <div key={apt.id} className="appointment-card">
                <div className="patient-info">
                  <div className="avatar">
                    {apt.patient_name 
                      ? apt.patient_name.split(' ').map((n) => n[0]).join('')
                      : apt.patient?.name?.split(' ').map((n) => n[0]).join('') || '?'}
                  </div>
                  <div>
                    <div className="patient-name">
                      {apt.patient_name || apt.patient?.name || 'Unknown Patient'}{' '}
                      {apt.patient_age && <span className="age">Age {apt.patient_age}</span>}
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor:
                            apt.status === 'confirmed' ? '#dcfce7' : 
                            apt.status === 'pending' ? '#fef3c7' : '#fee2e2',
                          color: 
                            apt.status === 'confirmed' ? '#166534' : 
                            apt.status === 'pending' ? '#92400e' : '#991b1b',
                        }}
                      >
                        {apt.status}
                      </span>
                      {apt.priority && (
                        <span
                          className="priority-tag"
                          style={{ 
                            backgroundColor: getPriorityColor(apt.priority) + '20', 
                            color: getPriorityColor(apt.priority) 
                          }}
                        >
                          {apt.priority}
                        </span>
                      )}
                    </div>
                    <p className="concern">{apt.reason || apt.concern || 'No reason provided'}</p>
                    <div className="appointment-meta">
                      <span>📅 {formatDate(apt.appointment_date || apt.date)}</span>
                      <span>🕒 {formatTime(apt.appointment_time || apt.time)}</span>
                      {apt.appointment_type && (
                        <span className="type-icon">{getTypeIcon(apt.appointment_type)}</span>
                      )}
                    </div>
                    {apt.notes && <p className="note">{apt.notes}</p>}
                  </div>
                </div>
                <div className="appointment-actions">
                  {apt.status !== 'confirmed' && (
                    <button 
                      className="accept-btn"
                      onClick={() => handleAccept(apt.id)}
                    >
                      Accept
                    </button>
                  )}
                  <button 
                    className="reschedule-btn"
                    onClick={() => handleReschedule(apt.id)}
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mobile Bottom Navbar */}
      <nav className="mobile-navbar">
        <button className="nav-item active">
          <Calendar size={24} />
          <span>Appointments</span>
        </button>
        <button className="nav-item">
          <MessageCircle size={24} />
          <span>Messages</span>
        </button>
        <button className="nav-item">
          <Users size={24} />
          <span>Patients</span>
        </button>
        <button className="nav-item">
          <BarChart3 size={24} />
          <span>Analytics</span>
        </button>
      </nav>

      {/* Floating Chat Button */}
      <button className="floating-chat">
        <MessageCircle size={24} />
        Talk with Us
      </button>
    </div>
  );
};

export default SpecialistDashboard;