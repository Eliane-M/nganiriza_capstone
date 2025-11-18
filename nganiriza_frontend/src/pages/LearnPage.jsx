import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LanguageContext } from '../contexts/AppContext';
import { Search, BookOpen, Clock, ChevronRight, Home, MessageCircle, Users, MapPin, User } from 'lucide-react';
import Navbar from '../assets/components/Navbar';
import apiClient from '../utils/apiClient';
import '../assets/css/learn/learn_page.css';

const LearnPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useContext(LanguageContext);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: MessageCircle, label: "Chat", path: "/chat" },
    { icon: Users, label: "Specialists", path: "/specialists" },
    { icon: MapPin, label: "Map", path: "/map" },
    { icon: BookOpen, label: "Learn", path: "/learn", active: true },
    { icon: User, label: "Profile", path: "/profile" }
  ];

  const translations = {
    title: { en: 'Learn About Health', rw: 'Wige Ku Buzima' },
    subtitle: { en: 'Educational articles about sexual and reproductive health', rw: 'Ingingo zerekana ubuzima bw\'imyororokere' },
    search: { en: 'Search articles...', rw: 'Shakisha ingingo...' },
    allTopics: { en: 'All Topics', rw: 'Ingingo Zose' },
    readMore: { en: 'Read More', rw: 'Soma Byinshi' },
    minRead: { en: 'min read', rw: 'iminota' },
    noArticles: { en: 'No articles found', rw: 'Nta ngingo zabonetse' },
  };

  const tags = [
    { id: 'all', label: { en: 'All Topics', rw: 'Byose' } },
    { id: 'puberty', label: { en: 'Puberty', rw: 'Ubugimbi' } },
    { id: 'relationships', label: { en: 'Relationships', rw: 'Imibanire' } },
    { id: 'contraception', label: { en: 'Contraception', rw: 'Kurinda' } },
    { id: 'sti', label: { en: 'STIs', rw: 'Indwara' } },
    { id: 'menstruation', label: { en: 'Menstruation', rw: 'Imihango' } },
  ];

  useEffect(() => {
    fetchArticles();
  }, [language]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        '/api/dashboard/articles/',
        {
          params: { locale: language === 'en' ? 'eng' : 'rw' }
        }
      );
      
      setArticles(response.data.results || []);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      // Set some fallback articles for demo
      setArticles([
        {
          id: 1,
          title: language === 'en' ? 'Understanding Puberty' : 'Gusobanukirwa Ubugimbi',
          excerpt: language === 'en' ? 'Learn about the physical and emotional changes during puberty...' : 'Wige ku mpinduka z\'umubiri n\'amarangamutima mu gihe cy\'ubugimbi...',
          tags: ['puberty'],
          read_time: 5,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || selectedTag === 'all' || 
                      article.tags?.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="learn-page" style={styles.page}>
      <Navbar />
      
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>{translations.title[language]}</h1>
          <p style={styles.subtitle}>{translations.subtitle[language]}</p>
        </div>

        {/* Search & Filter */}
        <div style={styles.controls}>
          <div style={styles.searchBox}>
            <Search size={20} style={{ color: '#9ca3af' }} />
            <input
              type="text"
              placeholder={translations.search[language]}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.tagsList}>
            {tags.map(tag => (
              <button
                key={tag.id}
                onClick={() => setSelectedTag(tag.id === 'all' ? null : tag.id)}
                style={{
                  ...styles.tag,
                  ...((!selectedTag && tag.id === 'all') || selectedTag === tag.id 
                    ? styles.tagActive 
                    : {})
                }}
              >
                {tag.label[language]}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div style={styles.loading}>Loading articles...</div>
        ) : filteredArticles.length > 0 ? (
          <div style={styles.grid}>
            {filteredArticles.map(article => (
              <article
                key={article.id}
                style={styles.card}
                onClick={() => navigate(`/learn/${article.id}`)}
              >
                <div style={styles.cardHeader}>
                  <BookOpen size={24} style={{ color: '#a855f7' }} />
                  <span style={styles.readTime}>
                    <Clock size={14} />
                    {article.read_time || 5} {translations.minRead[language]}
                  </span>
                </div>

                <h3 style={styles.cardTitle}>{article.title}</h3>
                <p style={styles.cardExcerpt}>{article.excerpt}</p>

                {article.tags && article.tags.length > 0 && (
                  <div style={styles.cardTags}>
                    {article.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} style={styles.cardTag}>{tag}</span>
                    ))}
                  </div>
                )}

                <button style={styles.readMoreBtn}>
                  {translations.readMore[language]}
                  <ChevronRight size={16} />
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div style={styles.empty}>
            <BookOpen size={48} style={{ color: '#d1d5db' }} />
            <p>{translations.noArticles[language]}</p>
          </div>
        )}
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

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #fdf4ff, #faf5ff)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    background: 'linear-gradient(to right, #a855f7, #ec4899)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '1rem',
  },
  subtitle: {
    fontSize: '1.125rem',
    color: '#666',
  },
  controls: {
    marginBottom: '2rem',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: 'white',
    border: '2px solid #e9d5ff',
    borderRadius: '1rem',
    padding: '0.875rem 1.25rem',
    marginBottom: '1.5rem',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '1rem',
  },
  tagsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
  },
  tag: {
    padding: '0.5rem 1rem',
    background: 'white',
    border: '2px solid #e9d5ff',
    borderRadius: '2rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#666',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tagActive: {
    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
    color: 'white',
    borderColor: 'transparent',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    background: 'white',
    border: '2px solid #e9d5ff',
    borderRadius: '1.25rem',
    padding: '1.5rem',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  readTime: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.875rem',
    color: '#666',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#2d1b3a',
    marginBottom: '0.75rem',
  },
  cardExcerpt: {
    fontSize: '0.9rem',
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '1rem',
  },
  cardTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  cardTag: {
    padding: '0.25rem 0.75rem',
    background: '#f3e8ff',
    borderRadius: '1rem',
    fontSize: '0.75rem',
    color: '#a855f7',
    fontWeight: '600',
  },
  readMoreBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#a855f7',
    background: 'none',
    border: 'none',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    padding: 0,
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    color: '#666',
    fontSize: '1.125rem',
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    color: '#999',
  },
};

export default LearnPage;