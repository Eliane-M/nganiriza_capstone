import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ChatPage } from './pages/ChatPage';
import { SpecialistPage } from './pages/SpecialistPage';
import { MapPage } from './pages/MapPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { useState } from 'react';
import SignupPage from './pages/SignupPage';
import LoginForm from './pages/LoginPage';
import { useA2HS } from './pwa/useA2HS'


function App() {

  return (
    <div>
      {/* <h1>Welcome to Nganiriza</h1>
      {canPrompt && (
        <button onClick={promptInstall}>Install App</button>
      )} */}
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/specialists" element={<SpecialistPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/learn" element={<ResourcesPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path='/login' element={<LoginForm />} />
        </Routes>
      </Router>
    </div>
    
  );
}

export default App;
