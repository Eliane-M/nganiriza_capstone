import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import apiClient, { setAuthHandlers } from '../../../utils/apiClient';
import { tokenStorage } from '../../../utils/tokenStorage';

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {
    throw new Error('AuthProvider not initialized');
  },
  logout: () => {},
  refreshTokens: async () => {}
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => tokenStorage.getUser());
  const [isLoading, setIsLoading] = useState(true);

  const persistUser = useCallback((nextUser) => {
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
    async (email, password) => {
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

