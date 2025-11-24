import React, { useState, useEffect } from "react";
import "../../assets/css/specialists/specialistdashboard.scss";
import {
  Calendar,
  MessageCircle,
  Users,
  BarChart3,
  Menu,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  CalendarClock,
} from "lucide-react";
import apiClient from "../../utils/apiClient";
import Navbar from "../../assets/components/Navbar";
import Sidebar from "../../assets/components/Sidebar";
import Tabs from "../../assets/components/Tabs";
import SpecialistMessageThread from "../../assets/components/SpecialistMessageThread";
import SpecialistAppointmentsTable from "../../assets/components/SpecialistAppointmentsTable";
import { AuthContext } from "../../assets/components/context/AuthContext";

const SpecialistDashboard = () => {
  const [stats, setStats] = useState({
    today_appointments: 0,
    unread_messages: 0,
    active_patients: 0,
    week_appointments: 0,
  });
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientMessages, setPatientMessages] = useState([]);
  const [patientAppointments, setPatientAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loadingPatientData, setLoadingPatientData] = useState(false);
  const [error, setError] = useState(null);
  const [specialistName, setSpecialistName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("appointments");

  useEffect(() => {
    fetchDashboardData();
    loadPatients();
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      loadPatientData(selectedPatient.user_id);
    }
  }, [selectedPatient]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, profileRes] = await Promise.all([
        apiClient.get("/api/specialists/dashboard/stats/"),
        apiClient
          .get("/api/specialists/profile/")
          .catch(() => ({ data: { name: "Doctor" } })),
      ]);

      setSpecialistName(profileRes?.data?.user?.name);   
      setStats(statsRes.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadPatients = async () => {
    try {
      setLoadingPatients(true);
      const response = await apiClient.get("/api/specialists/patients/");
      setPatients(response.data.results || []);
    } catch (err) {
      console.error("Failed to load patients:", err);
    } finally {
      setLoadingPatients(false);
    }
  };

  const loadPatientData = async (userId) => {
    try {
      setLoadingPatientData(true);
      // Get messages for this patient - all messages between specialist and this patient
      const messagesResponse = await apiClient.get(
        "/api/specialists/messages/inbox/"
      );
      const allMessages =
        messagesResponse.data?.results || messagesResponse.data || [];
      // Filter messages where user matches the patient
      const filteredMessages = allMessages.filter((msg) => {
        const msgUserId = msg.user_info?.id || msg.user;
        return msgUserId === userId;
      });
      // Sort by created_at
      filteredMessages.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
      setPatientMessages(filteredMessages);

      // Get appointments for this patient
      const appointmentsResponse = await apiClient.get(
        "/api/specialists/appointments/specialist/"
      );
      const allAppointments =
        appointmentsResponse.data?.results || appointmentsResponse.data || [];
      // Filter appointments where user matches the patient
      const filteredAppointments = allAppointments.filter((apt) => {
        const aptUserId = apt.user || apt.patient?.id || apt.patient;
        return aptUserId === userId;
      });
      // Sort by date and time
      filteredAppointments.sort((a, b) => {
        const dateA = new Date(
          `${a.appointment_date || a.date} ${a.appointment_time || a.time}`
        );
        const dateB = new Date(
          `${b.appointment_date || b.date} ${b.appointment_time || b.time}`
        );
        return dateB - dateA; // Most recent first
      });
      setPatientAppointments(filteredAppointments);
    } catch (err) {
      console.error("Failed to load patient data:", err);
    } finally {
      setLoadingPatientData(false);
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setActiveTab("appointments"); // Reset to appointments tab
  };

  const handleRefresh = () => {
    fetchDashboardData();
    loadPatients();
    if (selectedPatient) {
      loadPatientData(selectedPatient.user_id);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="specialist-dashboard">
        <Navbar />
        <div style={{ textAlign: "center", padding: "2rem" }}>
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="specialist-dashboard">
        <Navbar />
        <div style={{ textAlign: "center", padding: "2rem", color: "#ef4444" }}>
          {error}
          <button
            onClick={fetchDashboardData}
            style={{ marginTop: "1rem", display: "block", margin: "1rem auto" }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "messages", label: "Messages", icon: MessageSquare },
  ];

  return (
    <div className="specialist-dashboard">
      <Navbar />

      {/* Main Layout Container */}
      <div
        className={`dashboard-layout ${!sidebarOpen ? "sidebar-closed" : ""}`}
      >
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          title="My Patients"
        >
          <div className="patients-sidebar-content">
            {loadingPatients ? (
              <div className="loading-text">Loading patients...</div>
            ) : patients.length === 0 ? (
              <div className="empty-patients">No patients yet</div>
            ) : (
              <div className="patients-list">
                {patients.map((patient) => (
                  <button
                    key={patient.user_id}
                    onClick={() => handlePatientSelect(patient)}
                    className={`patient-item ${
                      selectedPatient?.user_id === patient.user_id
                        ? "active"
                        : ""
                    } ${patient.has_active_conversation ? "has-active" : ""}`}
                  >
                    <div className="patient-avatar">
                      {patient.user_name?.charAt(0) || "P"}
                    </div>
                    <div className="patient-info">
                      <div className="patient-name-row">
                        <span className="patient-name">
                          {patient.user_name || "Unknown Patient"}
                        </span>
                        {(patient.unread_messages > 0 ||
                          patient.pending_appointments > 0) && (
                          <div className="patient-badges">
                            {patient.unread_messages > 0 && (
                              <span className="badge unread">
                                {patient.unread_messages}
                              </span>
                            )}
                            {patient.pending_appointments > 0 && (
                              <span className="badge pending">
                                {patient.pending_appointments}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="patient-meta">
                        {patient.last_action_date && (
                          <span className="last-action">
                            {patient.last_action_type === "appointment" ? (
                              <CalendarClock size={12} />
                            ) : (
                              <MessageSquare size={12} />
                            )}
                            {formatDateTime(patient.last_action_date)}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </Sidebar>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="sidebar-toggle-btn"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

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

        {/* Content Wrapper */}
        <div className="dashboard-content-wrapper">
          {!selectedPatient ? (
            <>
              {/* Header */}
              <header className="dashboard-header">
                <div>
                  <h1>Welcome back, {specialistName}</h1>
                  <p>Manage your appointments and patient communications</p>
                </div>
              </header>

              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon today">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h3>Today's Appointments</h3>
                    <p className="stat-number">
                      {stats.today_appointments || 0}
                    </p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon messages">
                    <MessageCircle size={24} />
                  </div>
                  <div>
                    <h3>Unread Messages</h3>
                    <p className="stat-number">{stats.unread_messages || 0}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon patients">
                    <Users size={24} />
                  </div>
                  <div>
                    <h3>Active Patients</h3>
                    <p className="stat-number">{stats.active_patients || 0}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon week">
                    <BarChart3 size={24} />
                  </div>
                  <div>
                    <h3>This Week</h3>
                    <p className="stat-number">
                      {stats.week_appointments || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="dashboard-empty-state">
                <Users size={48} />
                <h2>Select a patient to view details</h2>
                <p>
                  Choose a patient from the sidebar to see their appointments
                  and messages
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Patient Detail View */}
              <div className="patient-detail-view">
                <div className="patient-detail-header">
                  <button
                    onClick={() => setSelectedPatient(null)}
                    className="back-button"
                  >
                    ← Back to Dashboard
                  </button>
                  <div className="patient-header-info">
                    <div className="patient-header-avatar">
                      {selectedPatient.user_name?.charAt(0) || "P"}
                    </div>
                    <div>
                      <h2>{selectedPatient.user_name || "Unknown Patient"}</h2>
                      <p className="patient-header-email">
                        {selectedPatient.user_email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="patient-detail-content">
                  <Tabs
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                  />

                  <div className="tab-content">
                    {activeTab === "appointments" && (
                      <SpecialistAppointmentsTable
                        appointments={patientAppointments}
                        loading={loadingPatientData}
                        patientName={selectedPatient.user_name}
                        onRefresh={handleRefresh}
                      />
                    )}

                    {activeTab === "messages" && (
                      <SpecialistMessageThread
                        messages={patientMessages}
                        loading={loadingPatientData}
                        patientName={selectedPatient.user_name}
                        patientId={selectedPatient.user_id}
                        onMessageSent={handleRefresh}
                      />
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecialistDashboard;
