import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, BookOpen, Home, MessageCircle, Users, MapPin, User } from 'lucide-react';
import Navbar from '../assets/components/Navbar';
import apiClient from '../utils/apiClient';
import { LanguageContext } from '../contexts/AppContext';
import { useTranslation } from '../utils/translations';
import '../assets/css/learn/article_detail.css';

const ArticleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const { t } = useTranslation(language);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navItems = [
    { icon: Home, label: t('nav.home'), path: "/" },
    { icon: MessageCircle, label: t('nav.chat'), path: "/chat" },
    { icon: Users, label: t('nav.specialists'), path: "/specialists" },
    { icon: MapPin, label: t('nav.map'), path: "/map" },
    { icon: BookOpen, label: t('nav.learn'), path: "/learn", active: true },
    { icon: User, label: t('nav.profile'), path: "/profile" }
  ];

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(`/api/dashboard/articles/${id}/`);
      setArticle(response.data);
    } catch (err) {
      console.error('Failed to load article:', err);
      setError(err.response?.data?.error || 'Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const calculateReadTime = (content) => {
    if (!content) return 5;
    const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    const words = text.split(/\s+/).length;
    const readTime = Math.ceil(words / 200); // Average reading speed: 200 words per minute
    return readTime || 5;
  };

  if (loading) {
    return (
      <div className="article-detail-page">
        <Navbar />
        <div className="article-detail-container">
          <div className="article-loading">{t('article.loading')}</div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="article-detail-page">
        <Navbar />
        <div className="article-detail-container">
          <div className="article-error">
            <p>{error || t('article.error')}</p>
            <button onClick={() => navigate('/learn')} className="article-back-btn">
              <ChevronLeft size={18} />
              {t('article.back')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const readTime = calculateReadTime(article.body_md);

  return (
    <div className="article-detail-page">
      <Navbar />
      
      <div className="article-detail-container">
        <button onClick={() => navigate('/learn')} className="article-back-btn">
          <ChevronLeft size={18} />
          {t('article.back')}
        </button>

        <article className="article-content">
          <header className="article-header">
            <div className="article-meta">
              <span className="article-read-time">
                <Clock size={16} />
                {readTime} {t('article.readTime')}
              </span>
              {article.tags && article.tags.length > 0 && (
                <div className="article-tags">
                  {article.tags.map((tag, idx) => (
                    <span key={idx} className="article-tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
            <h1 className="article-title">{article.title}</h1>
          </header>

          <div 
            className="article-body"
            dangerouslySetInnerHTML={{ __html: article.body_md || '' }}
          />

          <footer className="article-footer">
            <button onClick={() => navigate('/learn')} className="article-back-link">
              <ChevronLeft size={16} />
              Back to all articles
            </button>
          </footer>
        </article>
      </div>

      {/* Bottom Navigation Bar - Mobile Only */}
      <div className="bottom-nav">
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
};

export default ArticleDetailPage;

