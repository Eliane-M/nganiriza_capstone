import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import AdminSidebar from '../../assets/components/admin/AdminSidebar';
import Navbar from '../../assets/components/Navbar';
import '../../assets/css/admin/admin_dashboard.css';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="admin-dashboard">
      <Navbar />
      
      <div className={`admin-layout ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Mobile Toggle Button */}
        <button 
          onClick={() => setSidebarOpen(true)} 
          className="admin-sidebar-toggle-btn"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Menu button when sidebar is closed on desktop */}
        {!sidebarOpen && (
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="admin-sidebar-reopen-btn"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
        )}

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

