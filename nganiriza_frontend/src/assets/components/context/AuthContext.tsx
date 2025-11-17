import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  ReactNode
} from 'react';
import apiClient, { setAuthHandlers } from '../../../utils/apiClient';
import { tokenStorage } from '../../../utils/tokenStorage';

export interface User {
  id: number | string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  refreshTokens: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {
    throw new Error('AuthProvider not initialized');
  },
  logout: () => {},
  refreshTokens: async () => {}
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => tokenStorage.getUser());
  const [isLoading, setIsLoading] = useState(true);

  const persistUser = useCallback((nextUser: User | null) => {
    setUser(nextUser);
    tokenStorage.setUser(nextUser);
  }, []);

  const handleLogout = useCallback(() => {
    tokenStorage.clearAll();
    setUser(null);
  }, []);

  const fetchProfile = useCallback(async () => {
    const response = await apiClient.get('/api/auth/me/');
    persistUser(response.data);
  }, [persistUser]);

  const bootstrapAuth = useCallback(async () => {
    const access = tokenStorage.getAccessToken();
    const refresh = tokenStorage.getRefreshToken();
    if (!access || !refresh) {
      handleLogout();
      setIsLoading(false);
      return;
    }
    try {
      await fetchProfile();
    } catch (error) {
      console.error('Failed to bootstrap auth', error);
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  }, [fetchProfile, handleLogout]);

  useEffect(() => {
    bootstrapAuth();
  }, [bootstrapAuth]);

  useEffect(() => {
    setAuthHandlers({
      onLogout: handleLogout,
      onTokenRefresh: fetchProfile
    });
  }, [fetchProfile, handleLogout]);

  const login = useCallback(
    async (email: string, password: string): Promise<User> => {
      try {
        const response = await apiClient.post('/api/auth/login/', {
          username: email,
          password
        });
        const { access, refresh, user: userInfo, role } = response.data;
        tokenStorage.setTokens({ access, refresh });
        const normalizedUser = {
          ...userInfo,
          email: userInfo?.email || email,
          role
        };
        persistUser(normalizedUser);
        return normalizedUser;
      } catch (error) {
        console.error('Login failed', error);
        handleLogout();
        throw error;
      }
    },
    [handleLogout, persistUser]
  );

  const refreshTokens = useCallback(async () => {
    try {
      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        throw new Error('Missing refresh token');
      }
      await apiClient.post('/api/auth/token/refresh/', { refresh: refreshToken });
      await fetchProfile();
    } catch (error) {
      console.error('Refresh token failed', error);
      handleLogout();
      throw error;
    }
  }, [fetchProfile, handleLogout]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout: handleLogout,
      refreshTokens
    }),
    [user, isLoading, login, handleLogout, refreshTokens]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}