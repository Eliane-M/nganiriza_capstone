import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import BASE_URL from '../../config';

const SpecialistOnboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    specialty: '',
    license_number: '',
    years_of_experience: '',
    bio: '',
    education: '',
    certifications: '',
    languages_spoken: 'English, Kinyarwanda',
    availability: 'Mon-Fri 9AM-5PM',
    consultation_fee: '',
    clinic_name: '',
    clinic_address: '',
  });

  const specialtyOptions = [
    { value: 'gynecology', label: 'Gynecology' },
    { value: 'reproductive', label: 'Reproductive Health' },
    { value: 'mental', label: 'Mental Health Counseling' },
    { value: 'adolescent', label: 'Adolescent Medicine' },
    { value: 'nutrition', label: 'Nutrition & Dietetics' },
    { value: 'general', label: 'General Practice' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Auto-login first
      const email = sessionStorage.getItem('pending_specialist_email');
      const password = sessionStorage.getItem('pending_specialist_password');

      if (!email || !password) {
        throw new Error('Session expired. Please login again.');
      }

      // Login
      const loginRes = await axios.post(`${BASE_URL}/api/auth/login/`, {
        username: email,
        password: password,
      });

      const { access, refresh } = loginRes.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Clear session storage
      sessionStorage.removeItem('pending_specialist_email');
      sessionStorage.removeItem('pending_specialist_password');

      // Submit profile data
      const profileData = {
        ...formData,
        years_of_experience: parseInt(formData.years_of_experience) || 0,
        consultation_fee: parseFloat(formData.consultation_fee) || 0,
        certifications: formData.certifications.split(',').map(c => c.trim()),
        languages_spoken: formData.languages_spoken.split(',').map(l => l.trim()),
      };

      await axios.put(
        `${BASE_URL}/api/specialists/profile/update/`,
        profileData,
        { headers: { Authorization: `Bearer ${access}` } }
      );

      // Navigate to dashboard
      navigate('/specialist/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Complete Your Profile</h1>
          <p style={styles.subtitle}>Step {step} of 3</p>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${(step / 3) * 100}%` }} />
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div style={styles.stepContent}>
              <h2 style={styles.stepTitle}>Basic Information</h2>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Specialty *</label>
                <select
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  required
                  style={styles.select}
                >
                  <option value="">Select your specialty</option>
                  {specialtyOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>License Number *</label>
                <input
                  type="text"
                  name="license_number"
                  value={formData.license_number}
                  onChange={handleChange}
                  placeholder="Enter your medical license number"
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Years of Experience *</label>
                <input
                  type="number"
                  name="years_of_experience"
                  value={formData.years_of_experience}
                  onChange={handleChange}
                  placeholder="e.g., 5"
                  min="0"
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Professional Bio *</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about your experience and approach to patient care..."
                  required
                  rows="4"
                  style={styles.textarea}
                />
              </div>
            </div>
          )}

          {/* Step 2: Qualifications */}
          {step === 2 && (
            <div style={styles.stepContent}>
              <h2 style={styles.stepTitle}>Qualifications</h2>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Education *</label>
                <textarea
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  placeholder="e.g., MD, University of Rwanda, 2015"
                  required
                  rows="3"
                  style={styles.textarea}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Certifications (comma-separated)</label>
                <input
                  type="text"
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleChange}
                  placeholder="e.g., Board Certified, ACOG Member"
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Languages Spoken *</label>
                <input
                  type="text"
                  name="languages_spoken"
                  value={formData.languages_spoken}
                  onChange={handleChange}
                  placeholder="e.g., English, Kinyarwanda, French"
                  required
                  style={styles.input}
                />
              </div>
            </div>
          )}

          {/* Step 3: Practice Details */}
          {step === 3 && (
            <div style={styles.stepContent}>
              <h2 style={styles.stepTitle}>Practice Details</h2>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Clinic/Hospital Name *</label>
                <input
                  type="text"
                  name="clinic_name"
                  value={formData.clinic_name}
                  onChange={handleChange}
                  placeholder="e.g., Kigali Health Center"
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Clinic Address *</label>
                <input
                  type="text"
                  name="clinic_address"
                  value={formData.clinic_address}
                  onChange={handleChange}
                  placeholder="e.g., KG 123 St, Kigali"
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Availability *</label>
                <input
                  type="text"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  placeholder="e.g., Mon-Fri 9AM-5PM"
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Consultation Fee (RWF) *</label>
                <input
                  type="number"
                  name="consultation_fee"
                  value={formData.consultation_fee}
                  onChange={handleChange}
                  placeholder="e.g., 15000"
                  min="0"
                  required
                  style={styles.input}
                />
              </div>
            </div>
          )}

          {error && (
            <div style={styles.error}>{error}</div>
          )}

          {/* Navigation Buttons */}
          <div style={styles.buttonGroup}>
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                style={styles.backButton}
                disabled={loading}
              >
                <ChevronLeft size={20} />
                Back
              </button>
            )}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                style={styles.nextButton}
              >
                Next
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                type="submit"
                style={styles.submitButton}
                disabled={loading}
              >
                {loading ? 'Completing...' : (
                  <>
                    <Check size={20} />
                    Complete Profile
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #fdf4ff, #faf5ff)',
    padding: '2rem 1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    background: 'white',
    borderRadius: '1.5rem',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    padding: '2.5rem',
    maxWidth: '600px',
    width: '100%',
  },
  header: {
    marginBottom: '2rem',
    textAlign: 'center',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#2d1b3a',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#666',
    marginBottom: '1rem',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    background: '#e9d5ff',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(to right, #a855f7, #ec4899)',
    transition: 'width 0.3s ease',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  stepContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  stepTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2d1b3a',
    marginBottom: '0.5rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
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
  select: {
    padding: '0.875rem 1rem',
    border: '2px solid #e9d5ff',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s',
    background: 'white',
  },
  textarea: {
    padding: '0.875rem 1rem',
    border: '2px solid #e9d5ff',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'space-between',
    marginTop: '1rem',
  },
  backButton: {
    padding: '0.875rem 1.5rem',
    background: 'white',
    border: '2px solid #e9d5ff',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#666',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s',
  },
  nextButton: {
    padding: '0.875rem 1.5rem',
    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
    border: 'none',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    fontWeight: '600',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s',
    marginLeft: 'auto',
  },
  submitButton: {
    padding: '0.875rem 1.5rem',
    background: 'linear-gradient(135deg, #10b981, #059669)',
    border: 'none',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    fontWeight: '600',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s',
    marginLeft: 'auto',
  },
  error: {
    padding: '1rem',
    background: '#fee2e2',
    border: '1px solid #fecaca',
    borderRadius: '0.75rem',
    color: '#dc2626',
    fontSize: '0.9rem',
  },
};

export default SpecialistOnboarding;