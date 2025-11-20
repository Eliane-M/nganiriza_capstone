import React, { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import '../../assets/css/authPages/login.css';
import { AuthContext } from '../../assets/components/context/AuthContext';
// import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
// import { FacebookLoginButton } from 'react-social-login-buttons';
import facebook_icon from '../../images/facebook_icon.jpeg';
import google_icon from '../../images/google.jpeg';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg('');
    setLoading(true);

    try {
      const authenticatedUser = await login(email, password);
      const searchParams = new URLSearchParams(location.search);
      const redirectPath = searchParams.get('redirect');
      const defaultPath =
        authenticatedUser?.role === 'specialist' ? '/specialist/dashboard' : '/';
      const nextLocation = redirectPath
        ? decodeURIComponent(redirectPath)
        : defaultPath;
      navigate(nextLocation, { replace: true });

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
            <span />
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
              <img src={google_icon} alt="Google" /> Google
            </button>
            <button type="button" className="social-btn facebook">
              <img src={facebook_icon} alt="Facebook" /> Facebook
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