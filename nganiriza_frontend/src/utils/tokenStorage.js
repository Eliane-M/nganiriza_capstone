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

const write = (key, value) => {
  if (value === undefined || value === null) {
    return;
  }
  localStorage.setItem(key, value);
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
  getAccessToken: () => localStorage.getItem(ACCESS_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_KEY),
  clearTokens: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
  setUser: (user) => {
    if (!user) {
      localStorage.removeItem(USER_KEY);
      return;
    }
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  getUser: () => safeParse(localStorage.getItem(USER_KEY)),
  clearAll: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

