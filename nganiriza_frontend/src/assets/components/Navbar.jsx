import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, Sun, Moon, LogIn, UserPlus, ChevronDown, LogOut, User, Globe } from 'lucide-react';
import { ThemeContext, LanguageContext } from '../../contexts/AppContext';
import '../../assets/css/navbar/navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { language, setLanguage } = useContext(LanguageContext);
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_role');
    setIsAuthenticated(false);
    setUser(null);
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
      <div className="navbar-container">
        {/* Brand + Navigation */}
        <div className="navbar-left">
          <button onClick={() => handleNavigation('/')} className="brand">
            <span className="brand-name">Nganiriza</span>
          </button>
          
          <nav className="nav-links">
            <button onClick={() => handleNavigation('/chat')}>Chat with AI</button>
            <button onClick={() => handleNavigation('/specialists')}>Find Specialists</button>
            <button onClick={() => handleNavigation('/map')}>Health Map</button>
            <button onClick={() => handleNavigation('/learn')}>Learn</button>
          </nav>
        </div>

        {/* Right Controls */}
        <div className="navbar-right">
          {/* Profile Icon (when authenticated) */}
          {isAuthenticated && (
            <button
              onClick={() => handleNavigation('/profile')}
              className="profile-icon-btn"
              title="View Profile"
            >
              <div className="user-avatar-small">
                {getInitials()}
              </div>
            </button>
          )}

          {/* Dropdown Menu */}
          <div className="dropdown">
            <button
              onClick={() => setOpen(v => !v)}
              className="dropdown-trigger"
            >
              {!isAuthenticated ? (
                <div className="user-menu-guest">
                  <User className="user-icon" />
                  <span className="menu-text">Menu</span>
                </div>
              ) : (
                <div className="user-avatar">
                  {getInitials()}
                </div>
              )}
              <ChevronDown size={16} className="chevron" />
            </button>

            {open && (
              <div
                className="dropdown-menu"
                onMouseLeave={() => setOpen(false)}
              >
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

                {/* Auth Section */}
                <div className="dropdown-divider" />
                
                {!isAuthenticated ? (
                  <div className="dropdown-auth">
                    <button
                      onClick={() => handleNavigation('/login')}
                      className="dropdown-item"
                    >
                      <LogIn size={16}/> Log In
                    </button>
                    <button
                      onClick={() => handleNavigation('/signup')}
                      className="dropdown-item"
                    >
                      <UserPlus size={16}/> Sign Up
                    </button>
                  </div>
                ) : (
                  <div className="dropdown-auth">
                    <button
                      onClick={() => handleNavigation('/profile')}
                      className="dropdown-item"
                    >
                      <User size={16}/> Profile
                    </button>
                    <button
                      onClick={() => handleNavigation('/')}
                      className="dropdown-item"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item"
                    >
                      <LogOut size={16}/> Log Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn">
            <Menu size={18}/>
          </button>
        </div>
      </div>
    </header>
  );
}