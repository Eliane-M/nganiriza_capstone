import React, { useEffect, useState, createContext } from 'react';
interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
}
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, age?: number) => Promise<boolean>;
  logout: () => void;
}
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  signup: async () => false,
  logout: () => {}
});
interface AuthProviderProps {
  children: ReactNode;
}
export function AuthProvider({
  children
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('nganiriza_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call with timeout
    return new Promise(resolve => {
      setTimeout(() => {
        // In a real app, this would validate against a backend
        const users = JSON.parse(localStorage.getItem('nganiriza_users') || '[]');
        const foundUser = users.find((u: any) => u.email === email && u.password === password);
        if (foundUser) {
          const userToStore = {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            age: foundUser.age
          };
          setUser(userToStore);
          localStorage.setItem('nganiriza_user', JSON.stringify(userToStore));
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  };
  const signup = async (name: string, email: string, password: string, age?: number): Promise<boolean> => {
    // Simulate API call with timeout
    return new Promise(resolve => {
      setTimeout(() => {
        // In a real app, this would create a user in the backend
        const users = JSON.parse(localStorage.getItem('nganiriza_users') || '[]');
        // Check if email already exists
        if (users.some((u: any) => u.email === email)) {
          resolve(false);
          return;
        }
        const newUser = {
          id: `user-${Date.now()}`,
          name,
          email,
          password,
          age
        };
        users.push(newUser);
        localStorage.setItem('nganiriza_users', JSON.stringify(users));
        const userToStore = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          age: newUser.age
        };
        setUser(userToStore);
        localStorage.setItem('nganiriza_user', JSON.stringify(userToStore));
        resolve(true);
      }, 1000);
    });
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('nganiriza_user');
  };
  return <AuthContext.Provider value={{
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout
  }}>
      {children}
    </AuthContext.Provider>;
}