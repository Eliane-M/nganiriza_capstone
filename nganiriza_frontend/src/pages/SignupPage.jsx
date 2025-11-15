import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import '../assets/css/authPages/signup.css';
import BASE_URL from '../config.js';
import { Eye, EyeOff, UserPlus } from 'lucide-react';

const SignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userType: 'user',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    return v;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        role: formData.role,
      };

      await axios.post(`${BASE_URL}/api/auth/signup/`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      navigate('/login');
    } catch (err) {
      if (err.response?.status === 409) {
        setErrors((s) => ({ ...s, email: 'Email already exists. Use a different one.' }));
      } else {
        setSubmitError(
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
          Cancel
        </button>

        <div className="header">
          <h2>Join Our Community</h2>
          <p>Start your journey to better health awareness</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="user-type-selector">
            <span className="label">I am a:</span>
            <div className="toggle-buttons">
              <button
                type="button"
                className={`toggle-btn ${formData.userType === 'user' ? 'active' : ''}`}
                onClick={() => setFormData(s => ({ ...s, userType: 'user' }))}
              >
                User
              </button>
              <button
                type="button"
                className={`toggle-btn ${formData.userType === 'specialist' ? 'active' : ''}`}
                onClick={() => setFormData(s => ({ ...s, userType: 'specialist' }))}
              >
                Specialist
              </button>
            </div>
          </div>

          <div className="name-fields">
            <div className="input-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleInputChange}
              />
              {errors.firstName && <small className="error">{errors.firstName}</small>}
            </div>
            <div className="input-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleInputChange}
              />
              {errors.lastName && <small className="error">{errors.lastName}</small>}
            </div>
          </div>

          <div className="input-group full-width">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <small className="error">{errors.email}</small>}
          </div>

          <div className="input-group full-width">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPwd ? 'text' : 'password'}
                name="password"
                placeholder="Create a password"
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
            <label>Confirm Password</label>
            <div className="password-wrapper">
              <input
                type={showPwd2 ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm your password"
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
            {loading ? 'Creating...' : 'Create Account'}
          </button>

          <p className="signin-link">
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;