import React, { useEffect, useState, useContext } from 'react';
import { AuthForm } from '../components/AuthForm';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeftIcon } from 'lucide-react';
interface LoginPageProps {
  onNavigateToSignup: () => void;
  onNavigateToHome: () => void;
}
export function LoginPage({
  onNavigateToSignup,
  onNavigateToHome
}: LoginPageProps) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {
    login,
    isAuthenticated
  } = useContext(AuthContext);
  useEffect(() => {
    if (isAuthenticated) {
      onNavigateToHome();
    }
  }, [isAuthenticated, onNavigateToHome]);
  const handleLogin = async (data: any) => {
    setIsLoading(true);
    setError('');
    try {
      const success = await login(data.email, data.password);
      if (success) {
        onNavigateToHome();
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="flex flex-col min-h-screen bg-purple-50">
      <div className="bg-purple-600 text-white p-4 flex items-center">
        <button onClick={onNavigateToHome} className="mr-2">
          <ArrowLeftIcon size={20} />
        </button>
        <h1 className="text-xl font-semibold">Log In</h1>
      </div>
      <div className="flex-1 p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Welcome Back
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Log in to access your personalized health information
          </p>
          <AuthForm isSignup={false} onSubmit={handleLogin} isLoading={isLoading} error={error} />
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button onClick={onNavigateToSignup} className="text-purple-600 font-medium hover:underline">
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>;
}