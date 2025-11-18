import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, BookOpen, Users, UserCheck, LayoutDashboard } from 'lucide-react';
import Sidebar from '../Sidebar';

const AdminSidebar = ({ isOpen, onClose, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: MapPin, label: 'Map Management', path: '/admin/map' },
    { icon: BookOpen, label: 'Learning Resources', path: '/admin/learning' },
    { icon: UserCheck, label: 'Specialist Approval', path: '/admin/specialists' },
    { icon: Users, label: 'User Management', path: '/admin/users' },
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
      title="Admin Dashboard"
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

