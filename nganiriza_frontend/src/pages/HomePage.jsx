import React from 'react';
import Navbar from '../assets/components/Navbar.jsx';
import '../assets/css/homePage/homePage.css';
import hero_section from '../images/hero_section.jpg';

export function HomePage({ navigateTo }) {
  const features = [
    {
      icon: (
        <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2" />
        </svg>
      ),
      title: 'AI Health Companion',
      desc: 'Get instant, accurate answers about your body and health changes',
      onClick: () => navigateTo('chat'),
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
      onClick: () => navigateTo('specialists'),
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
      onClick: () => navigateTo('map'),
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
      onClick: () => navigateTo('learn'),
      gradientClass: 'gradient-yellow',
    },
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
                  onClick={() => navigateTo('chat')}
                  className="btn btn-primary"
                >
                  Start Chatting with AI
                </button>
                <button
                  onClick={() => navigateTo('specialists')}
                  className="btn btn-secondary"
                >
                  Find a Specialist
                </button>
              </div>
            </div>

            {/* Right Visual */}
            <div className="hero-visual">
              <img classname="hero-image"  alt=''/>
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
                onClick={() => navigateTo('signup')}
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
            <span>© {new Date().getFullYear()} Nganiriza</span>
            <div className="footer-links">
              <button onClick={() => navigateTo('help')}>Help Center</button>
              <button onClick={() => navigateTo('privacy')}>Privacy</button>
              <button onClick={() => navigateTo('terms')}>Terms</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}