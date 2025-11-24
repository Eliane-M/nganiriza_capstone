import React, { createContext, useState, useEffect } from 'react';

// Theme Context
export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

// Language Context  
export const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
});

// Combined Provider Component
export function AppProviders({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedTheme = localStorage.getItem('theme') || 'light';
      // Apply theme immediately to prevent flash
      const root = document.documentElement;
      const body = document.body;
      
      if (savedTheme === 'dark') {
        root.classList.add('dark');
        body.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.remove('dark');
        body.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
      }
      return savedTheme;
    }
    return 'light';
  });

  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('language') || 'en';
    }
    return 'en';
  });

  // Theme Effects
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
      // Also set data attribute for additional targeting
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  // Language Effects
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('language', language);
    }
  }, [language]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <LanguageContext.Provider value={{ language, setLanguage }}>
        {children}
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  );
}