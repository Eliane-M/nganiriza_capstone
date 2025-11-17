import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search as SearchIcon, Users, Heart, Brain, Apple, Stethoscope, Building2 } from 'lucide-react';
import { TextChatInterface } from '../../assets/components/TextChatInterface.tsx';
import { VideoCallInterface } from '../../assets/components/VideoCallInterface.tsx';
import '../../assets/css/specialists/specialist_page.css';
import BASE_URL from '../../config.js';

const CommunicationMode = {
  NONE: 'NONE',
  TEXT: 'TEXT',
  VIDEO: 'VIDEO',
};

export function SpecialistPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialists');
  const [communicationMode, setCommunicationMode] = useState(CommunicationMode.NONE);
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const specialties = [
    { id: 'all', name: 'All Specialists', icon: <Users size={16} /> },
    { id: 'gynecology', name: 'Gynecology', icon: <Building2 size={16} /> },
    { id: 'adolescent', name: 'Adolescent Medicine', icon: <Stethoscope size={16} /> },
    { id: 'reproductive', name: 'Reproductive Health', icon: <Heart size={16} /> },
    { id: 'mental', name: 'Mental Health', icon: <Brain size={16} /> },
    { id: 'nutrition', name: 'Nutrition', icon: <Apple size={16} /> },
  ];

  useEffect(() => {
    loadSpecialists();
  }, []);

  const loadSpecialists = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/specialists/`, {
        params: {
          specialty: selectedSpecialty !== 'All Specialists' ? selectedSpecialty.toLowerCase() : undefined,
          search: searchTerm,
        }
      });
      setSpecialists(res.data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTextChat = (specialistId) => {
    const specialist = specialists.find((s) => s.id === specialistId);
    if (specialist) {
      setSelectedSpecialist(specialist);
      setCommunicationMode(CommunicationMode.TEXT);
    }
  };

  const handleVideoCall = (specialistId) => {
    const specialist = specialists.find((s) => s.id === specialistId);
    if (specialist) {
      setSelectedSpecialist(specialist);
      setCommunicationMode(CommunicationMode.VIDEO);
    }
  };

  const handleBackToList = () => {
    setCommunicationMode(CommunicationMode.NONE);
    setSelectedSpecialist(null);
  };

  const handleSwitchToTextChat = () => {
    setCommunicationMode(CommunicationMode.TEXT);
  };

  const filteredSpecialists = specialists.filter((specialist) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      specialist.name.toLowerCase().includes(searchLower) ||
      specialist.specialty.toLowerCase().includes(searchLower);
    const matchesSpecialty =
      selectedSpecialty === 'All Specialists' ||
      specialist.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  if (loading) {
    return (
      <div className="specialist-page-v2">
        <div className="hero-section">
          <div className="loading-spinner">Loading specialists...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="specialist-page-v2">
        <div className="hero-section">
          <div className="error-message">
            <p>{error}</p>
            <button onClick={loadSpecialists} className="retry-button">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (communicationMode === CommunicationMode.TEXT && selectedSpecialist) {
    return <TextChatInterface specialist={selectedSpecialist} onBack={handleBackToList} />;
  }

  if (communicationMode === CommunicationMode.VIDEO && selectedSpecialist) {
    return (
      <VideoCallInterface
        specialist={selectedSpecialist}
        onBack={handleBackToList}
        onSwitchToTextChat={handleSwitchToTextChat}
      />
    );
  }

  return (
    <div className="specialist-page-v2">
      <div className="hero-section">
        <h1>
          Connect with trusted <span className="highlight">health specialists</span>
        </h1>
        <p className="subtitle">
          Book consultations with certified healthcare professionals who specialize in
          women's and adolescent health.
        </p>
      </div>

      <div className="search-filter-section">
        <div className="search-box">
          <SearchIcon size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or specialty"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="specialty-filters">
          {specialties.map((specialty) => (
            <button
              key={specialty.id}
              onClick={() => setSelectedSpecialty(specialty.name)}
              className={`specialty-pill ${
                selectedSpecialty === specialty.name ? 'active' : ''
              }`}
            >
              <span className="icon">{specialty.icon}</span>
              {specialty.name}
            </button>
          ))}
        </div>
      </div>

      <div className="specialists-grid">
        {specialists.length > 0 ? (
          specialists.map((specialist) => (
            <SpecialistCard
              key={specialist.id}
              specialist={specialist}
              onBookSession={() => handleVideoCall(specialist.id)}
            />
          ))
        ) : (
          <div className="empty-state">
            <p>No specialists match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SpecialistCard({ specialist, onBookSession }) {
  const getImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/150';
    if (url.startsWith('http')) return url;
    return `${BASE_URL}${url}`;
  };

  return (
    <div className="specialist-card-v2">
      <div className="card-header">
        <img
          src={getImageUrl(specialist.imageUrl || specialist.image || specialist.profile_picture)}
          alt={specialist.name}
          className="specialist-avatar"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/150?text=No+Image';
          }}
        />
        <div className="specialist-info">
          <h3>{specialist.name || 'Unknown Specialist'}</h3>
          <p className="specialty-tag">{specialist.specialty || 'General Practice'}</p>
          <div className="rating-row">
            <span className="star">⭐</span>
            <span className="rating-value">{specialist.rating || '4.5'}</span>
            <span className="review-count">
              · {specialist.reviews || specialist.review_count || 0} reviews
            </span>
          </div>
        </div>
      </div>

      <div className="card-details">
        <div className="detail-item">
          <span className="detail-icon">💼</span>
          <span>{specialist.experience || specialist.years_experience || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">📍</span>
          <span>{specialist.location || specialist.city || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">🕐</span>
          <span>{specialist.availability || 'Contact for availability'}</span>
        </div>
        <div className="detail-item languages">
          <span>{specialist.languages || 'English'}</span>
        </div>
      </div>

      <div className="card-footer">
        <div className="price-tag">
          <span className="price">
            ${specialist.price || specialist.consultation_fee || '150'}/session
          </span>
        </div>
        <button className="book-button" onClick={onBookSession}>
          Book Session
        </button>
      </div>
    </div>
  );
}

export default SpecialistPage;