import React, { useState, useEffect, useContext } from 'react';
import { Search as SearchIcon, Users, Heart, Brain, Apple, Stethoscope, Building2, ChevronLeft, Send, CalendarDays, Star, Briefcase, MapPin, Clock } from 'lucide-react';
import '../../assets/css/specialists/specialist_page.css';
import BASE_URL from '../../config.js';
import apiClient from '../../utils/apiClient';
import { AuthContext } from '../../assets/components/context/AuthContext';
import Navbar from '../../assets/components/Navbar';

export function SpecialistPage() {
  const { isAuthenticated } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialists');
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailSpecialist, setDetailSpecialist] = useState(null);

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
      const res = await apiClient.get('/api/specialists/', {
        params: {
          specialty: selectedSpecialty !== 'All Specialists' ? selectedSpecialty.toLowerCase() : undefined,
          search: searchTerm,
        }
      });
      const results = Array.isArray(res.data) ? res.data : res.data.results;
      setSpecialists(results || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSpecialist = (specialist) => {
    setDetailSpecialist(specialist);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseDetail = () => {
    setDetailSpecialist(null);
  };

  const filteredSpecialists = specialists.filter((specialist) => {
    const searchLower = searchTerm.toLowerCase();
    const name = (specialist.name || specialist.user?.name || '').toLowerCase();
    const specialtyValue = (specialist.specialty || '').toLowerCase();
    const specialtyLabel = (specialist.specialty_display || '').toLowerCase();

    const matchesSearch =
      name.includes(searchLower) ||
      specialtyValue.includes(searchLower) ||
      specialtyLabel.includes(searchLower);

    const matchesSpecialty =
      selectedSpecialty === 'All Specialists' ||
      specialtyLabel === selectedSpecialty.toLowerCase() ||
      specialtyValue === selectedSpecialty.toLowerCase();

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

  if (detailSpecialist) {
    return (
      <SpecialistDetailView
        specialist={detailSpecialist}
        onBack={handleCloseDetail}
        isAuthenticated={isAuthenticated}
      />
    );
  }

  return (
    <div className="specialist-page-v2">
      <Navbar />
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
              onSelect={() => handleSelectSpecialist(specialist)}
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

function SpecialistCard({ specialist, onSelect }) {
  const name = specialist.name || specialist.user?.name || 'Unknown Specialist';
  const specialtyLabel = specialist.specialty_display || specialist.specialty || 'General Practice';
  const experience = specialist.years_of_experience ?? specialist.years_experience ?? specialist.experience;
  const location = specialist.location?.district || specialist.location?.province || specialist.city || 'Available online';
  const availability = specialist.availability || 'Contact for availability';
  const languages = formatLanguages(specialist.languages_spoken || specialist.languages);
  const consultationFee = specialist.consultation_fee || specialist.price || '150';
  const reviews = specialist.total_reviews ?? specialist.review_count ?? specialist.reviews ?? 0;

  const handleCardKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect?.(specialist);
    }
  };

  return (
    <div
      className="specialist-card-v2"
      onClick={() => onSelect?.(specialist)}
      role="button"
      tabIndex={0}
      onKeyDown={handleCardKeyDown}
    >
      <div className="card-header">
        <img
          src={buildImageUrl(specialist.imageUrl || specialist.image || specialist.profile_image)}
          alt={name}
          className="specialist-avatar"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/150?text=No+Image';
          }}
        />
        <div className="specialist-info">
          <h3>{name}</h3>
          <p className="specialty-tag">{specialtyLabel}</p>
          <div className="rating-row">
            <Star size={16} className="star-icon" fill="currentColor" />
            <span className="rating-value">{Number(specialist.average_rating || specialist.rating || 4.5).toFixed(1)}</span>
            <span className="review-count">· {reviews} reviews</span>
          </div>
        </div>
      </div>

      <div className="card-details">
        <div className="detail-item">
          <Briefcase size={16} className="detail-icon" />
          <span>{experience ? `${experience}+ yrs experience` : 'Experience shared after booking'}</span>
        </div>
        <div className="detail-item">
          <MapPin size={16} className="detail-icon" />
          <span>{location}</span>
        </div>
        <div className="detail-item">
          <Clock size={16} className="detail-icon" />
          <span>{availability}</span>
        </div>
        <div className="detail-item languages">
          <span>{languages}</span>
        </div>
      </div>

      <div className="card-footer">
        <div className="price-tag">
          <span className="price">RWF {consultationFee}/session</span>
        </div>
        <button
          className="book-button"
          onClick={(event) => {
            event.stopPropagation();
            onSelect?.(specialist);
          }}
        >
          View Profile
        </button>
      </div>
    </div>
  );
}

function SpecialistDetailView({ specialist, onBack, isAuthenticated }) {
  const [appointmentForm, setAppointmentForm] = useState({
    appointment_date: '',
    appointment_time: '',
    notes: '',
  });
  const [messageForm, setMessageForm] = useState({
    subject: '',
    message: '',
  });
  const [appointmentFeedback, setAppointmentFeedback] = useState(null);
  const [messageFeedback, setMessageFeedback] = useState(null);
  const [appointmentLoading, setAppointmentLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);

  const handleAppointmentChange = (event) => {
    const { name, value } = event.target;
    setAppointmentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMessageChange = (event) => {
    const { name, value } = event.target;
    setMessageForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAppointmentSubmit = async (event) => {
    event.preventDefault();
    if (!isAuthenticated) {
      setAppointmentFeedback({ type: 'error', text: 'Please sign in to request an appointment.' });
      return;
    }
    if (!appointmentForm.appointment_date || !appointmentForm.appointment_time) {
      setAppointmentFeedback({ type: 'error', text: 'Please select a date and time.' });
      return;
    }

    setAppointmentLoading(true);
    setAppointmentFeedback(null);
    try {
      await apiClient.post(
        '/api/specialists/appointments/create/',
        {
          specialist: specialist.id,
          appointment_date: appointmentForm.appointment_date,
          appointment_time: appointmentForm.appointment_time,
          notes: appointmentForm.notes,
        }
      );
      setAppointmentFeedback({ type: 'success', text: 'Appointment request sent successfully.' });
      setAppointmentForm({
        appointment_date: '',
        appointment_time: '',
        notes: '',
      });
    } catch (err) {
      const fallback = err.response?.data?.error || 'Unable to submit appointment request.';
      setAppointmentFeedback({ type: 'error', text: fallback });
    } finally {
      setAppointmentLoading(false);
    }
  };

  const handleMessageSubmit = async (event) => {
    event.preventDefault();
    if (!isAuthenticated) {
      setMessageFeedback({ type: 'error', text: 'Please sign in to message the specialist.' });
      return;
    }
    if (!messageForm.subject || !messageForm.message) {
      setMessageFeedback({ type: 'error', text: 'Please add a subject and message.' });
      return;
    }

    setMessageLoading(true);
    setMessageFeedback(null);
    try {
      await apiClient.post(
        '/api/specialists/messages/create/',
        {
          specialist: specialist.id,
          subject: messageForm.subject,
          message: messageForm.message,
        }
      );
      setMessageFeedback({ type: 'success', text: 'Message delivered to the specialist.' });
      setMessageForm({
        subject: '',
        message: '',
      });
    } catch (err) {
      const fallback = err.response?.data?.error || 'Unable to send your message.';
      setMessageFeedback({ type: 'error', text: fallback });
    } finally {
      setMessageLoading(false);
    }
  };

  const name = specialist.name || specialist.user?.name || 'Specialist';
  const clinic = specialist.clinic_name || 'Independent Practice';
  const specialty = specialist.specialty_display || specialist.specialty || 'General Practice';
  const languages = formatLanguages(specialist.languages_spoken || specialist.languages);

  return (
    <div className="specialist-page-v2">
      <Navbar />
      <div className="specialist-detail-view">
        <button className="detail-back-button" onClick={onBack}>
          <ChevronLeft size={18} />
          Back to specialists
        </button>

        <div className="specialist-detail-card">
          <div className="detail-header">
            <img
              src={buildImageUrl(specialist.imageUrl || specialist.image || specialist.profile_image)}
              alt={name}
              className="detail-avatar"
            />
            <div>
              <p className="detail-specialty">{specialty}</p>
              <h2>{name}</h2>
              <p className="detail-clinic">{clinic}</p>
              <div className="detail-tags">
                <span>{languages}</span>
                {specialist.availability && <span>{specialist.availability}</span>}
              </div>
            </div>
          </div>
          <p className="detail-bio">{specialist.bio || 'This specialist will add more information soon.'}</p>
        </div>

        <div className="detail-forms-grid">
          <form className="detail-form" onSubmit={handleAppointmentSubmit}>
            <div className="detail-form-header">
              <CalendarDays size={20} />
              <h3>Request an appointment</h3>
            </div>
            <label>
              Preferred date
              <input
                type="date"
                name="appointment_date"
                value={appointmentForm.appointment_date}
                onChange={handleAppointmentChange}
                required
              />
            </label>
            <label>
              Preferred time
              <input
                type="time"
                name="appointment_time"
                value={appointmentForm.appointment_time}
                onChange={handleAppointmentChange}
                required
              />
            </label>
            <label>
              Notes (optional)
              <textarea
                name="notes"
                rows="4"
                value={appointmentForm.notes}
                onChange={handleAppointmentChange}
                placeholder="Share any symptoms or preferences..."
              />
            </label>
            {appointmentFeedback && (
              <p className={`form-feedback ${appointmentFeedback.type}`}>{appointmentFeedback.text}</p>
            )}
            <button type="submit" disabled={appointmentLoading}>
              {appointmentLoading ? 'Sending request...' : 'Send appointment request'}
            </button>
          </form>

          <form className="detail-form" onSubmit={handleMessageSubmit}>
            <div className="detail-form-header">
              <Send size={20} />
              <h3>Message this specialist</h3>
            </div>
            <label>
              Subject
              <input
                type="text"
                name="subject"
                value={messageForm.subject}
                onChange={handleMessageChange}
                placeholder="Short summary"
                required
              />
            </label>
            <label>
              Message
              <textarea
                name="message"
                rows="6"
                value={messageForm.message}
                onChange={handleMessageChange}
                placeholder="Introduce yourself and describe how they can help..."
                required
              />
            </label>
            {messageFeedback && (
              <p className={`form-feedback ${messageFeedback.type}`}>{messageFeedback.text}</p>
            )}
            <button type="submit" disabled={messageLoading}>
              {messageLoading ? 'Sending message...' : 'Send message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const buildImageUrl = (url) => {
  if (!url) {
    return 'https://via.placeholder.com/150';
  }
  if (url.startsWith('http')) {
    return url;
  }
  return `${BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
};

const formatLanguages = (value) => {
  if (!value) {
    return 'English';
  }
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  return value;
};

export default SpecialistPage;