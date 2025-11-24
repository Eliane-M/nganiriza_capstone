import React, { useContext } from 'react';
import { Send as SendIcon, Home, MessageCircle, Users, MapPin, ArrowLeft, User, BookOpen } from 'lucide-react';
import Navbar from '../assets/components/Navbar.jsx';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../contexts/AppContext';
import { useTranslation } from '../utils/translations';
import '../assets/css/homePage/homePage.css';
import hero_section from '../images/hero_section.jpg';
import { useA2HS } from '../pwa/useA2HS.js'

export function HomePage() {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const { t } = useTranslation(language);
  
  const features = [
    {
      icon: (
        <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2" />
        </svg>
      ),
      title: t('home.features.aiCompanion.title'),
      desc: t('home.features.aiCompanion.desc'),
      onClick: () => navigate('chat'),
      gradientClass: 'gradient-primary',
    },
    {
      icon: (
        <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2" />
        </svg>
      ),
      title: t('home.features.specialists.title'),
      desc: t('home.features.specialists.desc'),
      onClick: () => navigate('specialists'),
      gradientClass: 'gradient-pink',
    },
    {
      icon: (
        <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2" />
        </svg>
      ),
      title: t('home.features.map.title'),
      desc: t('home.features.map.desc'),
      onClick: () => navigate('map'),
      gradientClass: 'gradient-orange',
    },
    {
      icon: (
        <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2" />
        </svg>
      ),
      title: t('home.features.education.title'),
      desc: t('home.features.education.desc'),
      onClick: () => navigate('learn'),
      gradientClass: 'gradient-yellow',
    },
    
  ];
  const { canPrompt, promptInstall } = useA2HS()

  const navItems = [
    { icon: Home, label: t('nav.home'), path: "/", active: true},
    { icon: MessageCircle, label: t('nav.chat'), path: "/chat" },
    { icon: Users, label: t('nav.specialists'), path: "/specialists" },
    { icon: MapPin, label: t('nav.map'), path: "/map" },
    { icon: BookOpen, label: t('nav.learn'), path: "/learn" },
    { icon: User, label: t('nav.profile'), path: "/profile" }
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
                {t('home.heroTitle')}{' '}
                <span className="gradient-text">
                  {t('home.heroTitleHighlight')}
                </span>
              </h1>

              <p className="hero-description">
                {t('home.heroDescription')}
              </p>

              <div className="hero-actions">
                <button
                  onClick={() => navigate('chat')}
                  className="btn btn-primary"
                >
                  {t('home.startChatting')}
                </button>
                {canPrompt && (
                  <button
                    className="btn btn-primary"
                    onClick={promptInstall}
                  >
                    {t('home.installApp')}
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
                {t('home.ctaTitle')}
              </h4>
              <button
                onClick={() => navigate('signup')}
                className="btn btn-cta"
              >
                {t('home.ctaButton')}
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
                {t('home.footer.description')}
              </p>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-title">{t('home.footer.quickLinks')}</h4>
              <div className="footer-links">
                <button onClick={() => navigate('/')}>{t('nav.home')}</button>
                <button onClick={() => navigate('/chat')}>{t('nav.chat')}</button>
                <button onClick={() => navigate('/specialists')}>{t('nav.specialists')}</button>
                <button onClick={() => navigate('/map')}>{t('nav.map')}</button>
                <button onClick={() => navigate('/learn')}>{t('nav.learn')}</button>
              </div>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-title">{t('home.footer.resources')}</h4>
              <div className="footer-links">
                <button onClick={() => navigate('/learn')}>{t('home.footer.educationalResources')}</button>
                <button onClick={() => navigate('/specialists')}>{t('home.footer.findSpecialist')}</button>
                <button onClick={() => navigate('/map')}>{t('home.footer.healthServices')}</button>
              </div>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-title">{t('home.footer.legal')}</h4>
              <div className="footer-links">
                <button onClick={() => navigate('/privacy')}>{t('home.footer.privacyPolicy')}</button>
                <button onClick={() => navigate('/terms')}>{t('home.footer.termsOfService')}</button>
                <button onClick={() => navigate('/help')}>{t('home.footer.helpCenter')}</button>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Nganiriza. {t('home.footer.copyright')}</span>
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