import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, BookOpen, Users, UserCheck, LayoutDashboard } from 'lucide-react';
import { LanguageContext } from '../../../contexts/AppContext';
import { useTranslation } from '../../../utils/translations';
import Sidebar from '../Sidebar';

const AdminSidebar = ({ isOpen, onClose, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useContext(LanguageContext);
  const { t } = useTranslation(language);

  const menuItems = [
    { icon: LayoutDashboard, label: t('admin.dashboard'), path: '/admin' },
    { icon: MapPin, label: t('admin.map'), path: '/admin/map' },
    { icon: BookOpen, label: t('admin.learning'), path: '/admin/learning' },
    { icon: UserCheck, label: t('admin.specialists'), path: '/admin/specialists' },
    { icon: Users, label: t('admin.users'), path: '/admin/users' },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <Sidebar
      isOpen={isOpen}
      onClose={onClose}
      onToggle={onToggle}
      title={t('admin.dashboard')}
      className="admin-sidebar"
    >
      <nav className="admin-sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
                          (item.path !== '/admin' && location.pathname.startsWith(item.path));
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`admin-sidebar-item ${isActive ? 'active' : ''}`}
              aria-label={item.label}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </Sidebar>
  );
};

export default AdminSidebar;

