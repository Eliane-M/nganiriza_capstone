import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, Sun, Moon, LogIn, UserPlus, ChevronDown, LogOut, User } from 'lucide-react';
import { LanguageContext } from '../components/context/LanguageContext.tsx';
import { AuthContext } from '../components/context/AuthContext.tsx';
import { LanguageSwitcher } from '../components/LanguageSwitcher.tsx';
import '../css/navbar/navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const { language = 'en' } = useContext(LanguageContext) || {};
  const { isAuthenticated, user, logout } = useContext(AuthContext) || {};
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [open, setOpen] = useState(false);
  
  const initials = (user?.name || 'U N')
    .split(' ')
    .map(s => s[0]?.toUpperCase())
    .slice(0, 2)
    .join('');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleNavigation = (path) => {
    setOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout?.();
    setOpen(false);
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand + Navigation */}
        <div className="navbar-left">
          <button onClick={() => handleNavigation('/')} className="brand">
            <div className="brand-logo" />
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
                  {initials}
                </div>
              )}
              <ChevronDown size={16} className="chevron" />
            </button>

            {open && (
              <div
                className="dropdown-menu"
                onMouseLeave={() => setOpen(false)}
              >
                {/* Language + Theme Section */}
                <div className="dropdown-section">
                  <div className="section-label">Language</div>
                  <LanguageSwitcher />
                </div>
                
                <button
                  onClick={toggleTheme}
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
                      Profile
                    </button>
                    <button
                      onClick={() => handleNavigation('/dashboard')}
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