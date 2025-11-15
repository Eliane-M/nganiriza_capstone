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
      const res = await axios.post(
        `${BASE_URL}/api/auth/login/`,  // Make sure this matches your URL
        { 
          username: email,  // Backend expects "username", you're using email as username
          password
        },
        { 
          headers: { 'Content-Type': 'application/json' },
          withCredentials: false  // SimpleJWT doesn't need cookies by default
        }
      );

      // Correctly destructure your backend response
      const { 
        message, 
        access, 
        refresh, 
        role, 
        user 
      } = res.data;

      // Choose storage based on "Remember me"
      const storage = remember ? localStorage : sessionStorage;

      // Save tokens
      storage.setItem('access_token', access);
      storage.setItem('refresh_token', refresh);
      storage.setItem('user_role', role);        // "admin" or "user"
      storage.setItem('user', JSON.stringify(user));

      // Optional: Save login state
      storage.setItem('isLoggedIn', 'true');

      // Success message (optional)
      console.log(message);

      // Redirect based on role
      if (role === 'specialist') {
        navigate('/specialist/dashboard');
      } else {
        navigate('/'); 
      }

    } catch (err) {
      let errorMessage = 'Sign-in failed. Please try again.';

      if (err.response) {
        const data = err.response.data;

        if (err.response.status === 400) {
          errorMessage = data.error || 'Username and password are required.';
        } else if (err.response.status === 404) {
          errorMessage = data.error || 'Invalid credentials.';
        } else if (err.response.status === 500) {
          errorMessage = data.error || 'Server error. Try again later.';
        } else if (err.response.status === 401) {
          errorMessage = 'Unauthorized. Check your credentials.';
        }
      } else if (err.request) {
        errorMessage = 'No response from server. Check your connection.';
      }

      setErrMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
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
            <label>Email Address (Username)</label>
            <input
              type="text"  // Use "text" or "email" — depends on whether email is username
              placeholder="Enter your email or username"
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
                {showPwd ? 'Hide' : 'Show'}
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
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </form>

        {/* <button className="talk-btn" type="button">
          <span>Chat</span> Talk with Us
        </button> */}
      </div>
    </div>
  );
};

export default LoginForm;