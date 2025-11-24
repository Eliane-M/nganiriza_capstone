// src/pages/InvalidLink.jsx
import { useContext } from "react";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { LanguageContext } from '../../contexts/AppContext';
import { useTranslation } from '../../utils/translations';
import "../../assets/css/authPages/invalidlink.css";

export default function InvalidLink() {
  const { language } = useContext(LanguageContext);
  const { t } = useTranslation(language);
  
  return (
    <div className="invalid-page">
      <div className="invalid-card">
        <div className="icon-circle">
          <AlertCircle className="alert-icon" />
        </div>

        <h1>{t('auth.invalidLink.title')}</h1>
        <p className="subtitle">
          {t('auth.invalidLink.subtitle')}
        </p>

        <div className="message-box">
          <p>{t('auth.invalidLink.message') || 'Please request a new password reset link to continue.'}</p>

          <Link to="/reset-password">
            <button className="request-btn">{t('auth.invalidLink.requestNew') || 'Request New Link'}</button>
          </Link>

          <Link to="/login" className="back-btn">
            {t('auth.invalidLink.backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
}