import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ChatPage } from './pages/ChatPage';
import { SpecialistPage } from './pages/specialists/SpecialistPage';
import { MapPage } from './pages/MapPage';
import EducationPage from './pages/EducationPage';
import LearnPage from './pages/LearnPage';
import { ResourcesPage } from './pages/ResourcesPage';
import SignupPage from './pages/authentication/SignupPage';
import LoginForm from './pages/authentication/LoginPage';
import ResetPassword from './pages/authentication/ResetPassword';
import InvalidLink from './pages/authentication/InvalidLink';
import VerifyCode from './pages/authentication/VerifyCode';
import SetNewPassword from './pages/authentication/SetNewPassword';
import SpecialistDashboard from './pages/specialists/SpecialistDashboard';
import SpecialistOnboarding from './pages/specialists/SpecialistOnboarding';
import ProfilePage from './pages/UserProfilePage';
import { AppProviders } from '././contexts/AppContext';
import { AuthProvider } from './assets/components/context/AuthContext.tsx';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <div>
      <AppProviders>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/specialists" element={<SpecialistPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/education" element={<ResourcesPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/invalid-link" element={<InvalidLink />} />
              <Route path="/verify-code" element={<VerifyCode />} />
              <Route path="/set-new-password" element={<SetNewPassword />} />
              <Route
                path="/specialist/dashboard"
                element={
                  <ProtectedRoute>
                    <SpecialistDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/specialists/onboarding"
                element={
                  <ProtectedRoute>
                    <SpecialistOnboarding />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/learn"
                element={
                  <ProtectedRoute>
                    <LearnPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </AuthProvider>
      </AppProviders>
    </div>
  );
}

export default App;
