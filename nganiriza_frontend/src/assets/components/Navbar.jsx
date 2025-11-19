import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Sun, Moon, LogIn, ChevronDown, LogOut, User, Globe, MessageCircle, Users, MapPin, BookOpen } from 'lucide-react';
import { ThemeContext, LanguageContext } from '../../contexts/AppContext';
import { AuthContext } from './context/AuthContext';
import '../../assets/css/navbar/navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { language, setLanguage } = useContext(LanguageContext);
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  const handleNavigation = (path) => {
    setOpen(false);
    navigate(path);
  };

  const getInitials = () => {
    if (!user) return 'U';
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || 'U';
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'rw', label: 'Kinyarwanda' }
  ];

  return (
    <header className="navbar">
      <div className="navbar-tabs-container">
        <div className="navbar-tabs">
          {/* Brand on the left */}
          <button onClick={() => handleNavigation('/')} className="brand">
            <span className="brand-name">Nganiriza</span>
          </button>

          {/* Navigation Tabs */}
          <nav className="nav-tabs">
            <button 
              onClick={() => handleNavigation('/chat')}
              className={`nav-tab ${location.pathname === '/chat' ? 'active' : ''}`}
            >
              Chat with AI
            </button>
            <button 
              onClick={() => handleNavigation('/specialists')}
              className={`nav-tab ${location.pathname === '/specialists' || location.pathname.startsWith('/specialists/') ? 'active' : ''}`}
            >
              Find Specialists
            </button>
            <button 
              onClick={() => handleNavigation('/map')}
              className={`nav-tab ${location.pathname === '/map' ? 'active' : ''}`}
            >
              Health Map
            </button>
            <button 
              onClick={() => handleNavigation('/learn')}
              className={`nav-tab ${location.pathname === '/learn' || location.pathname.startsWith('/learn/') ? 'active' : ''}`}
            >
              Learn
            </button>
          </nav>

          {/* Right Controls */}
          <div className="navbar-right">
            {/* Login Button (when not authenticated) */}
            {!isAuthenticated && (
              <button
                onClick={() => handleNavigation('/login')}
                className="login-btn"
                title="Log In"
              >
                <LogIn size={18} />
                <span className="login-btn-text">Log In</span>
              </button>
            )}

            {/* Dropdown Menu (only shown when authenticated) */}
            {isAuthenticated && (
              <div className="dropdown">
                <button
                  onClick={() => setOpen(v => !v)}
                  className="dropdown-trigger"
                >
                  <div className="user-avatar">
                    {getInitials()}
                  </div>
                  <ChevronDown size={16} className="chevron" />
                </button>

                {open && (
                  <div
                    className="dropdown-menu"
                    onMouseLeave={() => setOpen(false)}
                  >
                    {/* User Info Section */}
                    <div className="dropdown-section">
                      <div className="user-info-header">
                        <div className="user-avatar-large">
                          {getInitials()}
                        </div>
                        <div className="user-info-text">
                          <div className="user-name">
                            {user?.first_name || user?.last_name 
                              ? `${user?.first_name || ''} ${user?.last_name || ''}`.trim()
                              : user?.email || 'User'}
                          </div>
                          <div className="user-email">
                            {user?.email || 'No email'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="dropdown-divider" />

                    {/* Navigation Items */}
                    <div className="dropdown-section">
                      <div className="section-label">Navigation</div>
                      <button
                        onClick={() => handleNavigation('/chat')}
                        className="dropdown-item"
                      >
                        <MessageCircle size={16} /> Chat with AI
                      </button>
                      <button
                        onClick={() => handleNavigation('/specialists')}
                        className="dropdown-item"
                      >
                        <Users size={16} /> Find Specialists
                      </button>
                      <button
                        onClick={() => handleNavigation('/map')}
                        className="dropdown-item"
                      >
                        <MapPin size={16} /> Health Map
                      </button>
                      <button
                        onClick={() => handleNavigation('/learn')}
                        className="dropdown-item"
                      >
                        <BookOpen size={16} /> Learn
                      </button>
                      <button
                        onClick={() => handleNavigation('/profile')}
                        className="dropdown-item"
                      >
                        <User size={16} /> Profile
                      </button>
                    </div>

                    <div className="dropdown-divider" />

                    {/* Language Section */}
                    <div className="dropdown-section">
                      <div className="section-label">
                        <Globe size={14} style={{ marginRight: '0.25rem' }} />
                        Language
                      </div>
                      <div className="language-switcher">
                        {languages.map(lang => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setLanguage(lang.code);
                              setOpen(false);
                            }}
                            className={`lang-btn ${language === lang.code ? 'active' : ''}`}
                          >
                            {lang.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Theme Toggle */}
                    <button
                      onClick={() => {
                        toggleTheme();
                        setOpen(false);
                      }}
                      className="dropdown-item"
                    >
                      {theme === 'dark' ? <Sun size={16}/> : <Moon size={16}/>}
                      <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
                    </button>

                    {/* Logout Section */}
                    <div className="dropdown-divider" />
                    <button
                      onClick={handleLogout}
                      className="dropdown-item logout-item"
                    >
                      <LogOut size={16}/> Log Out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button className="mobile-menu-btn">
              <Menu size={18}/>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}