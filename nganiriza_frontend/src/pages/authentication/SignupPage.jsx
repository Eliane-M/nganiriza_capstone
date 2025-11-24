import React, { useState, useContext } from 'react';
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../../utils/apiClient";
import { LanguageContext } from '../../contexts/AppContext';
import { useTranslation } from '../../utils/translations';
import '../../assets/css/authPages/signup.css';
import { Eye, EyeOff, UserPlus } from 'lucide-react';

const SignupPage = () => {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const { t } = useTranslation(language);

  const [formData, setFormData] = useState({
    userType: 'user',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone_number: '',
    date_of_birth: '',
    agree: false,
  });

  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((s) => ({ ...s, [name]: type === 'checkbox' ? checked : value }));
  };

  const clientValidate = () => {
    const v = {};
    if (!formData.firstName) v.firstName = 'First name is required';
    if (!formData.lastName) v.lastName = 'Last name is required';
    if (!formData.email) v.email = 'Email is required';
    else if (!validateEmail(formData.email)) v.email = 'Invalid email';
    if (!formData.password) v.password = 'Password is required';
    else if (formData.password.length < 6) v.password = 'Min 6 characters';
    if (formData.password !== formData.confirmPassword)
      v.confirmPassword = "Passwords don't match";
    if (!formData.agree) v.agree = 'You must agree to continue';
    
    if (formData.phone_number && !/^\+?[0-9]{10,15}$/.test(formData.phone_number)) {
      v.phone_number = 'Invalid phone number format';
    }
    
    return v;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setSubmitError('');
    const v = clientValidate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setLoading(true);
    try {
      const payload = {
        full_name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        role: formData.userType, // 'user' or 'specialist'
        phone_number: formData.phone_number || null,
        date_of_birth: formData.date_of_birth || null,
        place_of_origin: formData.place_of_origin || null,
        };

        console.log('Sending signup payload:', payload);

      const response = await apiClient.post(`/api/auth/signup/`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('Signup response:', response.data);

      // Check if user is specialist and needs onboarding
      if (formData.userType === 'specialist') {
        // Save email for auto-login after onboarding
        localStorage.setItem('pending_specialist_email', formData.email);
        localStorage.setItem('pending_specialist_password', formData.password);
        console.log('Navigating to specialist onboarding');
        navigate('/specialists/onboarding');
        window.location.href = '/specialists/onboarding';
      } else {
        // Regular user - go to login
        navigate('/login');
      }
    } catch (err) {
      console.error('Signup error:', err.response?.data || err.message);

      if (err.response?.status === 409) {
        setErrors((s) => ({ ...s, email: 'Email already exists. Use a different one.' }));
      } else if (err.response?.status === 400) {
        // Handle validation errors from backend
        const backendErrors = err.response.data;
        if (typeof backendErrors === 'object' && !backendErrors.error) {
          setErrors(backendErrors);
        } else {
          setSubmitError(backendErrors.error || 'Invalid data. Please check your inputs.');
        }
      } else {
        setSubmitError(
          err.response?.data?.error ||
          err.response?.data?.detail ||
          err.response?.data?.message ||
          'Signup failed. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="logo">
        <div className="logo-icon"><UserPlus/></div>
      </div>

      <div className="signup-card">
        <button
          type="button"
          className="cancel-btn"
          onClick={() => navigate('/')}
        >
          {t('common.cancel')}
        </button>

        <div className="header">
          <h2>{t('auth.signup.title')}</h2>
          <p>{t('auth.signup.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="user-type-selector">
            <span className="label">{t('auth.signup.userType') || 'I am a:'}</span>
            <div className="toggle-buttons">
              <button
                type="button"
                className={`toggle-btn ${formData.userType === 'user' ? 'active' : ''}`}
                onClick={() => setFormData(s => ({ ...s, userType: 'user' }))}
              >
                {t('auth.signup.user') || 'User'}
              </button>
              <button
                type="button"
                className={`toggle-btn ${formData.userType === 'specialist' ? 'active' : ''}`}
                onClick={() => setFormData(s => ({ ...s, userType: 'specialist' }))}
              >
                {t('auth.signup.specialist') || 'Specialist'}
              </button>
            </div>
          </div>

          <div className="name-fields">
            <div className="input-group">
              <label>{t('auth.signup.firstName')}</label>
              <input
                type="text"
                name="firstName"
                placeholder={t('auth.signup.firstName')}
                value={formData.firstName}
                onChange={handleInputChange}
              />
              {errors.firstName && <small className="error">{errors.firstName}</small>}
            </div>
            <div className="input-group">
              <label>{t('auth.signup.lastName')}</label>
              <input
                type="text"
                name="lastName"
                placeholder={t('auth.signup.lastName')}
                value={formData.lastName}
                onChange={handleInputChange}
              />
              {errors.lastName && <small className="error">{errors.lastName}</small>}
            </div>
          </div>

          <div className="input-group full-width">
            <label>{t('auth.signup.email')}</label>
            <input
              type="email"
              name="email"
              placeholder={t('auth.signup.email')}
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <small className="error">{errors.email}</small>}
          </div>

          {/* Optional fields */}
          <div className="input-group full-width">
            <label>Phone Number (optional)</label>
            <input
              type="tel"
              name="phone_number"
              placeholder="+250 XXX XXX XXX"
              value={formData.phone_number}
              onChange={handleInputChange}
            />
            {errors.phone_number && <small className="error">{errors.phone_number}</small>}
          </div>

          <div className="input-group full-width">
            <label>Date of Birth (optional)</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleInputChange}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.date_of_birth && <small className="error">{errors.date_of_birth}</small>}
          </div>

          <div className="input-group full-width">
            <label>{t('auth.signup.password')}</label>
            <div className="password-wrapper">
              <input
                type={showPwd ? 'text' : 'password'}
                name="password"
                placeholder={t('auth.signup.password')}
                value={formData.password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPwd(!showPwd)}
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <small className="error">{errors.password}</small>}
          </div>

          <div className="input-group full-width">
            <label>{t('auth.signup.confirmPassword')}</label>
            <div className="password-wrapper">
              <input
                type={showPwd2 ? 'text' : 'password'}
                name="confirmPassword"
                placeholder={t('auth.signup.confirmPassword')}
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPwd2(!showPwd2)}
              >
                {showPwd2 ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && <small className="error">{errors.confirmPassword}</small>}
          </div>

          <div className="terms">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              I agree to the Terms of Service and Privacy Policy
            </label>
            {errors.agree && <small className="error">{errors.agree}</small>}
          </div>

          {submitError && <div className="submit-error">{submitError}</div>}

          <button type="submit" className="create-account-btn" disabled={loading}>
            {loading ? t('common.loading') : t('auth.signup.createAccount')}
          </button>

          <p className="signin-link">
            {t('auth.signup.haveAccount')} <Link to="/login">{t('auth.signup.signIn')}</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;