import React from 'react';
import { Send as SendIcon, Home, MessageCircle, Users, MapPin, ArrowLeft, User, BookOpen } from 'lucide-react';
import Navbar from '../assets/components/Navbar.jsx';
import { useNavigate } from 'react-router-dom';
import '../assets/css/homePage/homePage.css';
import hero_section from '../images/hero_section.jpg';
import { useA2HS } from '../pwa/useA2HS.js'

export function HomePage() {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: (
        <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2" />
        </svg>
      ),
      title: 'AI Health Companion',
      desc: 'Get instant, accurate answers about your body and health changes',
      onClick: () => navigate('chat'),
      gradientClass: 'gradient-primary',
    },
    {
      icon: (
        <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2" />
        </svg>
      ),
      title: 'Expert Specialists',
      desc: 'Connect with certified healthcare professionals who understand you',
      onClick: () => navigate('specialists'),
      gradientClass: 'gradient-pink',
    },
    {
      icon: (
        <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2" />
        </svg>
      ),
      title: 'Health Services Map',
      desc: 'Find nearby clinics, pharmacies, and emergency services instantly',
      onClick: () => navigate('map'),
      gradientClass: 'gradient-orange',
    },
    {
      icon: (
        <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2" />
        </svg>
      ),
      title: 'Educational Resources',
      desc: 'Learn about your body with age-appropriate, medically accurate content',
      onClick: () => navigate('learn'),
      gradientClass: 'gradient-yellow',
    },
    
  ];
  const { canPrompt, promptInstall } = useA2HS()

  const navItems = [
    { icon: Home, label: "Home", path: "/", active: true},
    { icon: MessageCircle, label: "Chat", path: "/chat" },
    { icon: Users, label: "Specialists", path: "/specialists" },
    { icon: MapPin, label: "Map", path: "/map" },
    { icon: BookOpen, label: "Learn", path: "/learn" },
    { icon: User, label: "Profile", path: "/profile" }
  ];

  return (
    <div className="homepage">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            {/* Left Content */}
            <div className="hero-content">
              <h1 className="hero-title">
                Your trusted companion for{' '}
                <span className="gradient-text">
                  sexual and reproductive health
                </span>
              </h1>

              <p className="hero-description">
                Get your journey with confidence. Get answers, find support, and stay empowered in a safe, private space.
              </p>

              <div className="hero-actions">
                <button
                  onClick={() => navigate('chat')}
                  className="btn btn-primary"
                >
                  Start Chatting with AI
                </button>
                {canPrompt && (
                  <button
                    className="btn btn-primary"
                    onClick={promptInstall}
                  >
                    Install App
                  </button>
                )}
                {/* <button className='btn btn-primary' onClick={promptInstall}>Install App</button> */}
              </div>
            </div>

            {/* Right Visual */}
            <div className="hero-visual">
              {/* This image will be visible on desktop, background on mobile */}
              <img 
                className="hero-image"
                src={hero_section} 
                alt="Platform preview"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            {features.map((card) => (
              <button
                key={card.title}
                onClick={card.onClick}
                className="feature-card"
              >
                <div className={`feature-icon-wrapper ${card.gradientClass}`}>
                  {card.icon}
                </div>

                <h3 className="feature-title">{card.title}</h3>
                <p className="feature-desc">{card.desc}</p>
              </button>
            ))}
          </div>

          {/* CTA Band */}
          <div className="cta-band">
            <div className="cta-content">
              <h4 className="cta-title">
                Everything you need to feel confident and informed
              </h4>
              <button
                onClick={() => navigate('signup')}
                className="btn btn-cta"
              >
                Get Started Today
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4 className="footer-title">Nganiriza</h4>
              <p className="footer-description">
                Your trusted companion for sexual and reproductive health
              </p>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-title">Quick Links</h4>
              <div className="footer-links">
                <button onClick={() => navigate('/')}>Home</button>
                <button onClick={() => navigate('/chat')}>Chat</button>
                <button onClick={() => navigate('/specialists')}>Specialists</button>
                <button onClick={() => navigate('/map')}>Map</button>
                <button onClick={() => navigate('/learn')}>Learn</button>
              </div>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-title">Resources</h4>
              <div className="footer-links">
                <button onClick={() => navigate('/learn')}>Educational Resources</button>
                <button onClick={() => navigate('/specialists')}>Find a Specialist</button>
                <button onClick={() => navigate('/map')}>Health Services</button>
              </div>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-title">Legal</h4>
              <div className="footer-links">
                <button onClick={() => navigate('/privacy')}>Privacy Policy</button>
                <button onClick={() => navigate('/terms')}>Terms of Service</button>
                <button onClick={() => navigate('/help')}>Help Center</button>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Nganiriza. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* Bottom Navbar (Mobile only) */}
      <div className="bottom-navbar">
        {navItems.map((item, i) => (
          <button
            key={i}
            onClick={() => navigate(item.path)}
            className={`nav-item ${item.active ? 'active' : ''}`}
          >
            <item.icon size={24} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}