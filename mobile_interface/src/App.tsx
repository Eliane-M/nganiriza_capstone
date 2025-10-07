import React, { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { ChatPage } from './pages/ChatPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { EducationPage } from './pages/EducationPage';
import { SignupPage } from './pages/SignupPage';
import { LoginPage } from './pages/LoginPage';
import { SpecialistPage } from './pages/SpecialistPage';
import { MapPage } from './pages/MapPage';
import { Navbar } from './components/Navbar';
import { LanguageContext } from './context/LanguageContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
export function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [language, setLanguage] = useState('en'); // 'en', 'fr', 'rw'
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage navigateTo={setCurrentPage} />;
      case 'chat':
        return <ChatPage />;
      case 'resources':
        return <ResourcesPage />;
      case 'education':
        return <EducationPage />;
      case 'signup':
        return <SignupPage onNavigateToLogin={() => setCurrentPage('login')} onNavigateToHome={() => setCurrentPage('home')} />;
      case 'login':
        return <LoginPage onNavigateToSignup={() => setCurrentPage('signup')} onNavigateToHome={() => setCurrentPage('home')} />;
      case 'specialists':
        return <SpecialistPage />;
      case 'map':
        return <MapPage />;
      default:
        return <HomePage navigateTo={setCurrentPage} />;
    }
  };
  // Determine if we should show the navbar
  const shouldShowNavbar = !['signup', 'login'].includes(currentPage);
  return <AuthProvider>
      <LanguageContext.Provider value={{
      language,
      setLanguage
    }}>
        <div className="flex flex-col h-screen bg-purple-50 text-gray-800">
          <div className={`flex-1 overflow-y-auto ${shouldShowNavbar ? 'pb-16' : ''}`}>
            {renderPage()}
          </div>
          {shouldShowNavbar && <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />}
        </div>
      </LanguageContext.Provider>
    </AuthProvider>;
}