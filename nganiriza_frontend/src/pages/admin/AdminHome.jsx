import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, BookOpen, Users, UserCheck, ArrowRight } from 'lucide-react';
import { LanguageContext } from '../../contexts/AppContext';
import { useTranslation } from '../../utils/translations';

const AdminHome = () => {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const { t } = useTranslation(language);

  const quickActions = [
    {
      icon: MapPin,
      title: t('admin.map'),
      description: t('admin.mapDescription') || 'Add and manage health clinics',
      path: '/admin/map',
      color: 'bg-blue-500'
    },
    {
      icon: BookOpen,
      title: t('admin.learning'),
      description: t('admin.learningDescription') || 'Create and edit educational articles',
      path: '/admin/learning',
      color: 'bg-purple-500'
    },
    {
      icon: UserCheck,
      title: t('admin.specialists'),
      description: t('admin.specialistsDescription') || 'Review and approve specialist profiles',
      path: '/admin/specialists',
      color: 'bg-green-500'
    },
    {
      icon: Users,
      title: t('admin.users'),
      description: t('admin.usersDescription') || 'View and manage all users',
      path: '/admin/users',
      color: 'bg-orange-500'
    },
  ];

  return (
    <div className="admin-home">
      <div className="admin-home-header">
        <h1>{t('admin.dashboard')}</h1>
        <p>{t('admin.managePlatform') || 'Manage your platform from here'}</p>
      </div>

      <div className="admin-home-grid">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className="admin-home-card"
              tabIndex={0}
              aria-label={`Go to ${action.title}`}
            >
              <div className={`admin-home-card-icon ${action.color}`}>
                <Icon size={24} />
              </div>
              <div className="admin-home-card-content">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
              <ArrowRight size={20} className="admin-home-card-arrow" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AdminHome;

