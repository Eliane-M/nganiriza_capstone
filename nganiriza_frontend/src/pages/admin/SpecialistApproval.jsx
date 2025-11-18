import React, { useState, useEffect } from 'react';
import { Check, X, Eye, Search, UserCheck } from 'lucide-react';
import apiClient from '../../utils/apiClient';

const SpecialistApproval = () => {
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    loadPendingSpecialists();
  }, []);

  const loadPendingSpecialists = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/admin/specialists/pending/');
      setSpecialists(response.data || []);
    } catch (error) {
      console.error('Failed to load pending specialists:', error);
      setFeedback({ type: 'error', text: 'Failed to load pending specialists' });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Are you sure you want to approve this specialist?')) {
      return;
    }

    try {
      setProcessing(id);
      setFeedback(null);
      const response = await apiClient.put(`/api/admin/specialists/${id}/approve/`, {
        is_verified: true
      });
      setFeedback({ type: 'success', text: 'Specialist approved successfully' });
      loadPendingSpecialists();
      if (selectedSpecialist?.id === id) {
        setSelectedSpecialist(null);
      }
    } catch (error) {
      console.error('Approve error:', error);
      setFeedback({ 
        type: 'error', 
        text: error.response?.data?.error || error.message || 'Failed to approve specialist' 
      });
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this specialist?')) {
      return;
    }

    try {
      setProcessing(id);
      setFeedback(null);
      const response = await apiClient.put(`/api/admin/specialists/${id}/approve/`, {
        is_verified: false
      });
      setFeedback({ type: 'success', text: 'Specialist rejected' });
      loadPendingSpecialists();
      if (selectedSpecialist?.id === id) {
        setSelectedSpecialist(null);
      }
    } catch (error) {
      console.error('Reject error:', error);
      setFeedback({ 
        type: 'error', 
        text: error.response?.data?.error || error.message || 'Failed to reject specialist' 
      });
    } finally {
      setProcessing(null);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await apiClient.get(`/api/admin/specialists/${id}/`);
      setSelectedSpecialist(response.data);
    } catch (error) {
      console.error('Failed to load specialist details:', error);
      setFeedback({ type: 'error', text: 'Failed to load specialist details' });
    }
  };

  const filteredSpecialists = specialists.filter(specialist => {
    const name = specialist.user?.name || '';
    const specialty = specialist.specialty_display || specialist.specialty || '';
    const searchLower = searchTerm.toLowerCase();
    return name.toLowerCase().includes(searchLower) || 
           specialty.toLowerCase().includes(searchLower) ||
           specialist.license_number?.toLowerCase().includes(searchLower);
  });

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Specialist Approval</h1>
          <p>Review and approve specialist profiles</p>
        </div>
      </div>

      {feedback && (
        <div className={`admin-feedback ${feedback.type}`}>
          {feedback.text}
        </div>
      )}

      <div className="admin-page-content">
        <div className="admin-search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search specialists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="admin-loading">Loading pending specialists...</div>
        ) : filteredSpecialists.length > 0 ? (
          <div className="admin-specialists-list">
            {filteredSpecialists.map((specialist) => (
              <div key={specialist.id} className="admin-specialist-card">
                <div className="admin-specialist-card-header">
                  <div className="admin-specialist-card-info">
                    <h3>{specialist.user?.name || 'Unknown'}</h3>
                    <p className="admin-specialist-specialty">
                      {specialist.specialty_display || specialist.specialty}
                    </p>
                  </div>
                  <div className="admin-specialist-card-badges">
                    {specialist.profile_completed ? (
                      <span className="admin-badge admin-badge-success">Complete</span>
                    ) : (
                      <span className="admin-badge admin-badge-warning">Incomplete</span>
                    )}
                  </div>
                </div>

                <div className="admin-specialist-card-details">
                  <div className="admin-specialist-detail-row">
                    <span className="admin-specialist-detail-label">License:</span>
                    <span>{specialist.license_number || 'Not provided'}</span>
                  </div>
                  <div className="admin-specialist-detail-row">
                    <span className="admin-specialist-detail-label">Experience:</span>
                    <span>{specialist.years_of_experience || 0} years</span>
                  </div>
                  {specialist.clinic_name && (
                    <div className="admin-specialist-detail-row">
                      <span className="admin-specialist-detail-label">Clinic:</span>
                      <span>{specialist.clinic_name}</span>
                    </div>
                  )}
                </div>

                {specialist.bio && (
                  <div className="admin-specialist-card-bio">
                    <p>{specialist.bio.substring(0, 150)}...</p>
                  </div>
                )}

                <div className="admin-specialist-card-actions">
                  <button
                    onClick={() => handleViewDetails(specialist.id)}
                    className="admin-btn-secondary"
                    aria-label="View details"
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                  <button
                    onClick={() => handleApprove(specialist.id)}
                    className="admin-btn-success"
                    disabled={processing === specialist.id}
                    aria-label="Approve specialist"
                  >
                    {processing === specialist.id ? (
                      'Processing...'
                    ) : (
                      <>
                        <Check size={16} />
                        Approve
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleReject(specialist.id)}
                    className="admin-btn-danger"
                    disabled={processing === specialist.id}
                    aria-label="Reject specialist"
                  >
                    {processing === specialist.id ? (
                      'Processing...'
                    ) : (
                      <>
                        <X size={16} />
                        Reject
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="admin-empty-state">
            <UserCheck size={48} />
            <p>No pending specialists to review</p>
          </div>
        )}
      </div>

      {selectedSpecialist && (
        <div className="admin-modal">
          <div className="admin-modal-content admin-modal-content-large">
            <div className="admin-modal-header">
              <h2>Specialist Details</h2>
              <button
                onClick={() => setSelectedSpecialist(null)}
                className="admin-modal-close"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-specialist-detail-section">
                <h3>Personal Information</h3>
                <div className="admin-detail-grid">
                  <div>
                    <label>Name</label>
                    <p>{selectedSpecialist.user?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <label>Email</label>
                    <p>{selectedSpecialist.user?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <label>Specialty</label>
                    <p>{selectedSpecialist.specialty_display || selectedSpecialist.specialty}</p>
                  </div>
                  <div>
                    <label>License Number</label>
                    <p>{selectedSpecialist.license_number || 'Not provided'}</p>
                  </div>
                  <div>
                    <label>Years of Experience</label>
                    <p>{selectedSpecialist.years_of_experience || 0}</p>
                  </div>
                  <div>
                    <label>Consultation Fee</label>
                    <p>RWF {selectedSpecialist.consultation_fee || 0}</p>
                  </div>
                </div>
              </div>

              {selectedSpecialist.bio && (
                <div className="admin-specialist-detail-section">
                  <h3>Bio</h3>
                  <p>{selectedSpecialist.bio}</p>
                </div>
              )}

              {selectedSpecialist.education && (
                <div className="admin-specialist-detail-section">
                  <h3>Education</h3>
                  <p>{selectedSpecialist.education}</p>
                </div>
              )}

              {selectedSpecialist.clinic_name && (
                <div className="admin-specialist-detail-section">
                  <h3>Clinic Information</h3>
                  <div className="admin-detail-grid">
                    <div>
                      <label>Clinic Name</label>
                      <p>{selectedSpecialist.clinic_name}</p>
                    </div>
                    {selectedSpecialist.clinic_address && (
                      <div>
                        <label>Address</label>
                        <p>{selectedSpecialist.clinic_address}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedSpecialist.languages_spoken && selectedSpecialist.languages_spoken.length > 0 && (
                <div className="admin-specialist-detail-section">
                  <h3>Languages</h3>
                  <div className="admin-tags-list">
                    {selectedSpecialist.languages_spoken.map((lang, idx) => (
                      <span key={idx} className="admin-tag">{lang}</span>
                    ))}
                  </div>
                </div>
              )}

              {selectedSpecialist.certifications && selectedSpecialist.certifications.length > 0 && (
                <div className="admin-specialist-detail-section">
                  <h3>Certifications</h3>
                  <ul>
                    {selectedSpecialist.certifications.map((cert, idx) => (
                      <li key={idx}>{cert}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="admin-modal-actions">
                <button
                  onClick={async () => {
                    await handleApprove(selectedSpecialist.id);
                    setSelectedSpecialist(null);
                  }}
                  className="admin-btn-success"
                  disabled={processing === selectedSpecialist.id}
                >
                  <Check size={16} />
                  Approve
                </button>
                <button
                  onClick={async () => {
                    await handleReject(selectedSpecialist.id);
                    setSelectedSpecialist(null);
                  }}
                  className="admin-btn-danger"
                  disabled={processing === selectedSpecialist.id}
                >
                  <X size={16} />
                  Reject
                </button>
                <button
                  onClick={() => setSelectedSpecialist(null)}
                  className="admin-btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialistApproval;

