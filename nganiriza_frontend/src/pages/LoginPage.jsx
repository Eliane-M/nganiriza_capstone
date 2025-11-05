import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/authPages/login.css';
import BASE_URL from '../config.js';

const LoginForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg('');
    setLoading(true);

    try {
      // Adjust payload/URL/response shape to your API contract
      const res = await axios.post(
        `${BASE_URL}/api/auth/login/`,
        { 
          username:email, 
          password
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Example expected response
      // { access_token, refresh_token, user: {...} }
      const { access_token, refresh_token, user } = res.data || {};

      const storage = remember ? localStorage : sessionStorage;
      if (access_token) storage.setItem('access_token', access_token);
      if (refresh_token) storage.setItem('refresh_token', refresh_token);
      if (user) storage.setItem('user', JSON.stringify(user));

      navigate('/'); // or /dashboard
    } catch (err) {
      const apiMsg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        (err.response?.status === 401 ? 'Invalid email or password.' : null);

      setErrMsg(apiMsg || 'Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        {/* simple header with Cancel -> Home */}
        <div className="login-header">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate('/')}
            aria-label="Cancel and go to homepage"
          >
            ✖ <span>Cancel</span>
          </button>
          <h2>Welcome Back</h2>
          <div className="spacer" />
        </div>

        <p className="subtitle">Continue your health journey with us</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPwd ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPwd((s) => !s)}
                aria-label={showPwd ? 'Hide password' : 'Show password'}
              >
              </button>
            </div>
          </div>

          <div className="options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span className="checkmark"></span>
              Remember me
            </label>
            <Link to="/reset-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>

          {errMsg && <div className="submit-error">{errMsg}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Logging in…' : 'Log In'}
          </button>

          <div className="divider">
            <span>Or continue with</span>
          </div>

          <div className="social-buttons">
            <button type="button" className="social-btn google">
              G Google
            </button>
            <button type="button" className="social-btn facebook">
              f Facebook
            </button>
          </div>

          <p className="switch-link">
            Don&apos;t have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </form>

        <button className="talk-btn" type="button">
          <span>Chat</span> Talk with Us
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
