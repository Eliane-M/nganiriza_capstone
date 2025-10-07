import React, { useEffect, useState, useContext } from 'react';
import { AuthForm } from '../components/AuthForm';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeftIcon } from 'lucide-react';
interface SignupPageProps {
  onNavigateToLogin: () => void;
  onNavigateToHome: () => void;
}
export function SignupPage({
  onNavigateToLogin,
  onNavigateToHome
}: SignupPageProps) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {
    signup,
    isAuthenticated
  } = useContext(AuthContext);
  useEffect(() => {
    if (isAuthenticated) {
      onNavigateToHome();
    }
  }, [isAuthenticated, onNavigateToHome]);
  const handleSignup = async (data: any) => {
    setIsLoading(true);
    setError('');
    try {
      const success = await signup(data.name, data.email, data.password, data.age);
      if (success) {
        onNavigateToHome();
      } else {
        setError('This email is already registered. Please use a different email.');
      }
    } catch (err) {
      setError('An error occurred during signup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="flex flex-col min-h-screen bg-purple-50">
      <div className="bg-purple-600 text-white p-4 flex items-center">
        <button onClick={onNavigateToHome} className="mr-2">
          <ArrowLeftIcon size={20} />
        </button>
        <h1 className="text-xl font-semibold">Create Account</h1>
      </div>
      <div className="flex-1 p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Join Nganiriza
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Create an account to access personalized health information and
            resources
          </p>
          <AuthForm isSignup={true} onSubmit={handleSignup} isLoading={isLoading} error={error} />
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button onClick={onNavigateToLogin} className="text-purple-600 font-medium hover:underline">
                Log In
              </button>
            </p>
          </div>
          <div className="mt-8">
            <p className="text-xs text-center text-gray-500">
              By creating an account, you agree to our Terms of Service and
              Privacy Policy. Your information is secure and will never be
              shared without your permission.
            </p>
          </div>
        </div>
      </div>
    </div>;
}