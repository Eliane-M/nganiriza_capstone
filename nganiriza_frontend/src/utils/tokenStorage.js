const ACCESS_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';
const USER_KEY = 'auth_user';

const safeParse = (value) => {
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error('Failed to parse stored user', error);
    return null;
  }
};

const isLocalStorageAvailable = () => {
  return typeof window !== 'undefined' && window.localStorage;
};

const write = (key, value) => {
  if (value === undefined || value === null) {
    return;
  }
  if (isLocalStorageAvailable()) {
    localStorage.setItem(key, value);
  }
};

export const tokenStorage = {
  setTokens: ({ access, refresh }) => {
    if (access) {
      write(ACCESS_KEY, access);
    }
    if (refresh) {
      write(REFRESH_KEY, refresh);
    }
  },
  getAccessToken: () => isLocalStorageAvailable() ? localStorage.getItem(ACCESS_KEY) : null,
  getRefreshToken: () => isLocalStorageAvailable() ? localStorage.getItem(REFRESH_KEY) : null,
  clearTokens: () => {
    if (isLocalStorageAvailable()) {
      localStorage.removeItem(ACCESS_KEY);
      localStorage.removeItem(REFRESH_KEY);
    }
  },
  setUser: (user) => {
    if (!isLocalStorageAvailable()) return;
    if (!user) {
      localStorage.removeItem(USER_KEY);
      return;
    }
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  getUser: () => isLocalStorageAvailable() ? safeParse(localStorage.getItem(USER_KEY)) : null,
  clearAll: () => {
    if (isLocalStorageAvailable()) {
      localStorage.removeItem(ACCESS_KEY);
      localStorage.removeItem(REFRESH_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }
};

