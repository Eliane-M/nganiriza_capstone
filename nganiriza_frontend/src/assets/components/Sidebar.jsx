import React from 'react';
import { X, Menu } from 'lucide-react';
import '../css/components/sidebar.css';

const Sidebar = ({ isOpen, onClose, onToggle, title, children, className = '' }) => {
  return (
    <>
      {/* Overlay - only on mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      
      {/* Sidebar - always visible on desktop, toggleable on mobile */}
      <aside className={`sidebar ${className} ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">{title}</h2>
          <div className="sidebar-header-actions">
            {/* Desktop Toggle Button */}
            {onToggle && (
              <button 
                onClick={onToggle} 
                className="sidebar-toggle-header" 
                aria-label="Toggle sidebar"
              >
                <Menu size={20} />
              </button>
            )}
            {/* Mobile Close Button */}
            <button onClick={onClose} className="sidebar-close" aria-label="Close sidebar">
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="sidebar-content">
          {children}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

