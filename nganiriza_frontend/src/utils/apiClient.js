import axios from 'axios';
import BASE_URL from '../config';
import { tokenStorage } from './tokenStorage';

const apiClient = axios.create({
  baseURL: BASE_URL,
});

const authHandlers = {
  onLogout: () => {},
  onTokenRefresh: () => {},
};

export const setAuthHandlers = ({ onLogout, onTokenRefresh }) => {
  if (onLogout) {
    authHandlers.onLogout = onLogout;
  }
  if (onTokenRefresh) {
    authHandlers.onTokenRefresh = onTokenRefresh;
  }
};

apiClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

const refreshAccessToken = async () => {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      subscribeTokenRefresh((tokenOrError) => {
        if (tokenOrError instanceof Error) {
          reject(tokenOrError);
        } else {
          resolve(tokenOrError);
        }
      });
    });
  }

  isRefreshing = true;
  try {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error('Missing refresh token');
    }
    const response = await axios.post(`${BASE_URL}/api/auth/token/refresh/`, {
      refresh: refreshToken,
    });
    const { access } = response.data;
    if (!access) {
      throw new Error('Refresh endpoint did not return an access token');
    }
    tokenStorage.setTokens({ access, refresh: refreshToken });
    authHandlers.onTokenRefresh(access);
    onRefreshed(access);
    return access;
  } catch (error) {
    onRefreshed(error);
    tokenStorage.clearAll();
    authHandlers.onLogout();
    throw error;
  } finally {
    isRefreshing = false;
  }
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

