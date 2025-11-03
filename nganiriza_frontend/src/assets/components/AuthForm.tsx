import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon, UserIcon, MailIcon, LockIcon } from 'lucide-react';
interface AuthFormProps {
  isSignup?: boolean;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  error?: string;
}
export function AuthForm({
  isSignup = false,
  onSubmit,
  isLoading,
  error
}: AuthFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      age: formData.age ? parseInt(formData.age) : undefined
    };
    onSubmit(submitData);
  };
  return <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      {isSignup && <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserIcon size={18} className="text-gray-400" />
          </div>
          <input type="text" name="name" placeholder="Full Name" required value={formData.name} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MailIcon size={18} className="text-gray-400" />
        </div>
        <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <LockIcon size={18} className="text-gray-400" />
        </div>
        <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" required value={formData.password} onChange={handleChange} className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
        <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <EyeOffIcon size={18} className="text-gray-400" /> : <EyeIcon size={18} className="text-gray-400" />}
        </button>
      </div>
      {isSignup && <div className="relative">
          <input type="number" name="age" placeholder="Age (optional)" value={formData.age} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit" disabled={isLoading} className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-200 flex justify-center items-center">
        {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <span>{isSignup ? 'Sign Up' : 'Log In'}</span>}
      </button>
    </form>;
}