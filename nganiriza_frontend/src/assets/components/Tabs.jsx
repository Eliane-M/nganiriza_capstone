import React from 'react';
import '../css/components/tabs.css';

const Tabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="tabs-container">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          >
            {Icon && <Icon size={18} />}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;

