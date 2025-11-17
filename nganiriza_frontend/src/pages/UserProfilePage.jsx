import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X } from 'lucide-react';
import Navbar from '../assets/components/Navbar';
import apiClient from '../utils/apiClient';
import { AuthContext } from '../assets/components/context/AuthContext';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user: authUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await apiClient.get('/api/dashboard/profile/');
      
      setProfile(response.data.profile);
      setFormData(response.data.profile);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.put(
        '/api/dashboard/profile/update/',
        formData
      );
      
      setProfile(formData);
      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setEditing(false);
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <Navbar />
        <div style={styles.loading}>Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={styles.page}>
        <Navbar />
        <div style={styles.error}>Failed to load profile</div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Navbar />
      
      <div style={styles.container}>
        <div style={styles.card}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.avatarSection}>
              <div style={styles.avatar}>
                <User size={48} />
              </div>
              <div>
                <h1 style={styles.name}>
                  {profile.user?.first_name || authUser?.first_name} {profile.user?.last_name || authUser?.last_name}
                </h1>
                <p style={styles.email}>{profile.user?.email || authUser?.email}</p>
              </div>
            </div>

            {!editing ? (
              <button onClick={() => setEditing(true)} style={styles.editBtn}>
                <Edit2 size={18} />
                Edit Profile
              </button>
            ) : (
              <div style={styles.actionButtons}>
                <button onClick={handleSave} style={styles.saveBtn} disabled={saving}>
                  <Save size={18} />
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={handleCancel} style={styles.cancelBtn}>
                  <X size={18} />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Profile Details */}
          <div style={styles.details}>
            <div style={styles.detailGroup}>
              <label style={styles.label}>
                <Mail size={18} />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profile.user?.email || ''}
                disabled
                style={{ ...styles.input, ...styles.inputDisabled }}
              />
            </div>

            <div style={styles.detailGroup}>
              <label style={styles.label}>
                <Phone size={18} />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone_number"
                value={editing ? formData.phone_number || '' : profile.phone_number || 'Not provided'}
                onChange={handleChange}
                disabled={!editing}
                style={editing ? styles.input : { ...styles.input, ...styles.inputDisabled }}
                placeholder="Enter your phone number"
              />
            </div>

            <div style={styles.detailGroup}>
              <label style={styles.label}>
                <Calendar size={18} />
                Date of Birth
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={editing ? formData.date_of_birth || '' : profile.date_of_birth || ''}
                onChange={handleChange}
                disabled={!editing}
                style={editing ? styles.input : { ...styles.input, ...styles.inputDisabled }}
              />
            </div>

            <div style={styles.detailGroup}>
              <label style={styles.label}>
                <MapPin size={18} />
                Location
              </label>
              <input
                type="text"
                value={profile.location || 'Kigali, Rwanda'}
                disabled
                style={{ ...styles.input, ...styles.inputDisabled }}
              />
            </div>

            <div style={styles.detailGroup}>
              <label style={styles.label}>
                <User size={18} />
                Gender
              </label>
              <select
                name="gender"
                value={editing ? formData.gender || '' : profile.gender || ''}
                onChange={handleChange}
                disabled={!editing}
                style={editing ? styles.input : { ...styles.input, ...styles.inputDisabled }}
              >
                <option value="">Select gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
          </div>

          {/* Account Info */}
          <div style={styles.accountInfo}>
            <h3 style={styles.sectionTitle}>Account Information</h3>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Member Since</span>
                <span style={styles.infoValue}>
                  {new Date(profile.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Account Type</span>
                <span style={styles.infoValue}>
                  {profile.account?.role === 'specialist' ? 'Health Specialist' : 'User'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #fdf4ff, #faf5ff)',
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  card: {
    background: 'white',
    borderRadius: '1.5rem',
    padding: '2rem',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    paddingBottom: '2rem',
    borderBottom: '2px solid #e9d5ff',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
  name: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#2d1b3a',
    marginBottom: '0.25rem',
  },
  email: {
    color: '#666',
    fontSize: '0.9rem',
  },
  editBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  actionButtons: {
    display: 'flex',
    gap: '0.75rem',
  },
  saveBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  cancelBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    background: 'white',
    color: '#666',
    border: '2px solid #e9d5ff',
    borderRadius: '0.75rem',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  details: {
    display: 'grid',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  detailGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    padding: '0.875rem 1rem',
    border: '2px solid #e9d5ff',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s',
  },
  inputDisabled: {
    background: '#f9fafb',
    color: '#666',
    cursor: 'not-allowed',
  },
  accountInfo: {
    paddingTop: '2rem',
    borderTop: '2px solid #e9d5ff',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#2d1b3a',
    marginBottom: '1rem',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  infoLabel: {
    fontSize: '0.85rem',
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: '1rem',
    color: '#2d1b3a',
    fontWeight: '600',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60vh',
    fontSize: '1.125rem',
    color: '#666',
  },
  error: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60vh',
    fontSize: '1.125rem',
    color: '#ef4444',
  },
};

export default ProfilePage;