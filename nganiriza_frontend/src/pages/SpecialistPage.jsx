import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Users, Heart, Brain, Apple, Stethoscope, Building2 } from 'lucide-react';
import { specialistService } from '../assets/components/specialistService';
import { TextChatInterface } from '../assets/components/TextChatInterface.tsx';
import { VideoCallInterface } from '../assets/components/VideoCallInterface.tsx';
import '../assets/css/specialists/specialist_page.css';

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
      setError(null);
      const data = await specialistService.getAll();

      // Defensive: ensure array and normalize minimal fields to avoid crashes
      const safe = Array.isArray(data) ? data : [];
      const normalized = safe.map((s) => ({
        id: s.id ?? String(Math.random()),
        name: s.name ?? 'Unknown',
        specialty: s.specialty ?? 'General',
        imageUrl: s.imageUrl ?? 'https://via.placeholder.com/80',
        rating: typeof s.rating === 'number' ? s.rating : 0,
        reviews: typeof s.reviews === 'number' ? s.reviews : 0,
        experience: s.experience ?? '—',
        location: s.location ?? '—',
        availability: s.availability ?? '—',
        languages: Array.isArray(s.languages) ? s.languages.join(', ') : (s.languages ?? '—'),
        price: typeof s.price === 'number' ? s.price : 0,
      }));

      setSpecialists(normalized);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to load specialists';
      setError(message);
      console.error('Error loading specialists:', err);
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
        {filteredSpecialists.length > 0 ? (
          filteredSpecialists.map((specialist) => (
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
  return (
    <div className="specialist-card-v2">
      <div className="card-header">
        <img
          src={specialist.imageUrl}
          alt={specialist.name}
          className="specialist-avatar"
        />
        <div className="specialist-info">
          <h3>{specialist.name}</h3>
          <p className="specialty-tag">{specialist.specialty}</p>
          <div className="rating-row">
            <span className="star">⭐</span>
            <span className="rating-value">{specialist.rating}</span>
            <span className="review-count">· {specialist.reviews} reviews</span>
          </div>
        </div>
      </div>

      <div className="card-details">
        <div className="detail-item">
          <span className="detail-icon">💼</span>
          <span>{specialist.experience}</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">📍</span>
          <span>{specialist.location}</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">🕐</span>
          <span>{specialist.availability}</span>
        </div>
        <div className="detail-item languages">
          <span>{specialist.languages}</span>
        </div>
      </div>

      <div className="card-footer">
        <div className="price-tag">
          <span className="price">${specialist.price}/session</span>
        </div>
        <button className="book-button" onClick={onBookSession}>
          Book Session
        </button>
      </div>
    </div>
  );
};

// export default SpecialistPage;
