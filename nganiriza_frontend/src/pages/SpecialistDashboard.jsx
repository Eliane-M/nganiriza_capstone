import React, {useState, useEffect} from 'react';
import '../assets/css/specialists/specialistdashboard.scss';
import { Calendar, MessageCircle, Users, BarChart3, Plus, Phone, Video, MessageSquare } from 'lucide-react';
import BASE_URL from '../config';
import axios from 'axios';

const SpecialistDashboard = () => {
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('access_token');
    
    try {
      const [statsRes, appointmentsRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/specialists/dashboard/stats/`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${BASE_URL}/api/specialists/appointments/specialist/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setStats(statsRes.data);
      setAppointments(appointmentsRes.data.results);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    }
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div>
          <h1>Welcome back, Dr. Johnson</h1>
          <p>Manage your appointments and patient communications</p>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon today"><Calendar size={24} /></div>
          <div>
            <h3>Today's Appointments</h3>
            <p className="stat-number">3</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon messages"><MessageCircle size={24} /></div>
          <div>
            <h3>Unread Messages</h3>
            <p className="stat-number">2</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon patients"><Users size={24} /></div>
          <div>
            <h3>Active Patients</h3>
            <p className="stat-number">24</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon week"><BarChart3 size={24} /></div>
          <div>
            <h3>This Week</h3>
            <p className="stat-number">12</p>
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
          {upcomingAppointments.map((apt) => (
            <div key={apt.id} className="appointment-card">
              <div className="patient-info">
                <div className="avatar">
                  {apt.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="patient-name">
                    {apt.name} <span className="age">Age {apt.age}</span>
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor:
                          apt.status === 'confirmed' ? '#dcfce7' : '#fef3c7',
                        color: apt.status === 'confirmed' ? '#166534' : '#92400e',
                      }}
                    >
                      {apt.status}
                    </span>
                    <span
                      className="priority-tag"
                      style={{ backgroundColor: getPriorityColor(apt.priority) + '20', color: getPriorityColor(apt.priority) }}
                    >
                      {apt.priority}
                    </span>
                  </div>
                  <p className="concern">{apt.concern}</p>
                  <div className="appointment-meta">
                    <span>📅 {apt.date}</span>
                    <span>🕒 {apt.time}</span>
                    <span className="type-icon">{getTypeIcon(apt.type)}</span>
                  </div>
                  {apt.note && <p className="note">{apt.note}</p>}
                </div>
              </div>
              <div className="appointment-actions">
                <button className="accept-btn">Accept</button>
                <button className="reschedule-btn">Reschedule</button>
              </div>
            </div>
          ))}
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