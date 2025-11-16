import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ChatPage } from './pages/ChatPage';
import { SpecialistPage } from './pages/SpecialistPage';
import { MapPage } from './pages/MapPage';
import EducationPage from './pages/EducationPage';
import LearnPage from './pages/LearnPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { useState } from 'react';
import SignupPage from './pages/SignupPage';
import LoginForm from './pages/LoginPage';
import { useA2HS } from './pwa/useA2HS';
import ResetPassword from './pages/ResetPassword';
import InvalidLink from './pages/InvalidLink';
import VerifyCode from './pages/VerifyCode';
import SetNewPassword from './pages/SetNewPassword';
import SpecialistDashboard from './pages/SpecialistDashboard';
import SpecialistOnboarding from './pages/SpecialistOnboarding';
import { AppProviders } from '././contexts/AppContext';


function App() {

  return (
    <div>
      <AppProviders>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/specialists" element={<SpecialistPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/education" element={<ResourcesPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path='/login' element={<LoginForm />} />
            <Route path='/reset-password' element={<ResetPassword />} />
            <Route path='/invalid-link' element={<InvalidLink />} />
            <Route path='/verify-code' element={<VerifyCode />} />
            <Route path='/set-new-password' element={<SetNewPassword />} />
            <Route path='/specialist/dashboard' element={<SpecialistDashboard />} />
            <Route path='/specialist/onboard' element={<SpecialistOnboarding />} />
            <Route path='/learn' element={<LearnPage />} />
          </Routes>
        </Router>
      </AppProviders>
    </div>
    
  );
}

export default App;
