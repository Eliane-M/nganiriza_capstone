import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, AuthContext } from './AuthContext';
import apiClient from '../../../utils/apiClient';
import { tokenStorage } from '../../../utils/tokenStorage';

// Mock dependencies
jest.mock('../../../utils/apiClient');
jest.mock('../../../utils/tokenStorage');

const TestComponent = () => {
  const { user, isAuthenticated, isLoading, login, logout } = React.useContext(AuthContext);

  return (
    <div>
      <div data-testid="loading">{isLoading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
      {user && <div data-testid="user-email">{user.email}</div>}
      <button onClick={() => login('test@example.com', 'password123')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    tokenStorage.getAccessToken.mockReturnValue(null);
    tokenStorage.getRefreshToken.mockReturnValue(null);
    tokenStorage.getUser.mockReturnValue(null);
    tokenStorage.setTokens.mockImplementation(() => {});
    tokenStorage.setUser.mockImplementation(() => {});
    tokenStorage.clearAll.mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('starts with loading state', () => {
    apiClient.get.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('Loading');
  });

  test('initializes with no user when no tokens in storage', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated');
    });
  });

  test('bootstraps authentication with stored tokens', async () => {
    tokenStorage.getAccessToken.mockReturnValue('mock-access-token');
    tokenStorage.getRefreshToken.mockReturnValue('mock-refresh-token');
    
    apiClient.get.mockResolvedValueOnce({
      data: {
        id: 1,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        role: 'user',
      },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    });

    expect(apiClient.get).toHaveBeenCalledWith('/api/auth/me/');
  });

  test('logs out when bootstrap fails', async () => {
    tokenStorage.getAccessToken.mockReturnValue('mock-access-token');
    tokenStorage.getRefreshToken.mockReturnValue('mock-refresh-token');
    
    apiClient.get.mockRejectedValueOnce(new Error('Unauthorized'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated');
    });

    expect(tokenStorage.clearAll).toHaveBeenCalled();
  });

  test('logs in successfully', async () => {
    apiClient.post.mockResolvedValueOnce({
      data: {
        access: 'new-access-token',
        refresh: 'new-refresh-token',
        user: {
          first_name: 'John',
          last_name: 'Doe',
        },
        role: 'user',
      },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    const loginButton = screen.getByText('Login');
    loginButton.click();

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/api/auth/login/', {
        username: 'test@example.com',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(tokenStorage.setTokens).toHaveBeenCalledWith({
        access: 'new-access-token',
        refresh: 'new-refresh-token',
      });
      expect(tokenStorage.setUser).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          role: 'user',
        })
      );
    });
  });

  test('handles login failure', async () => {
    apiClient.post.mockRejectedValueOnce({
      response: { data: { error: 'Invalid credentials' } },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    const loginButton = screen.getByText('Login');
    
    await expect(async () => {
      loginButton.click();
      await waitFor(() => {
        expect(apiClient.post).toHaveBeenCalled();
      });
    }).rejects.toThrow();

    await waitFor(() => {
      expect(tokenStorage.clearAll).toHaveBeenCalled();
    });
  });

  test('logs out successfully', async () => {
    tokenStorage.getAccessToken.mockReturnValue('mock-access-token');
    tokenStorage.getRefreshToken.mockReturnValue('mock-refresh-token');
    
    apiClient.get.mockResolvedValueOnce({
      data: {
        id: 1,
        email: 'test@example.com',
        role: 'user',
      },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
    });

    const logoutButton = screen.getByText('Logout');
    logoutButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated');
      expect(tokenStorage.clearAll).toHaveBeenCalled();
    });
  });

  test('persists user data to storage on login', async () => {
    apiClient.post.mockResolvedValueOnce({
      data: {
        access: 'token-123',
        refresh: 'refresh-456',
        user: {
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane@example.com',
        },
        role: 'specialist',
      },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    });

    const loginButton = screen.getByText('Login');
    loginButton.click();

    await waitFor(() => {
      expect(tokenStorage.setUser).toHaveBeenCalledWith(
        expect.objectContaining({
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'test@example.com',
          role: 'specialist',
        })
      );
    });
  });

  test('clears all storage on logout', async () => {
    tokenStorage.getAccessToken.mockReturnValue('mock-access-token');
    tokenStorage.getRefreshToken.mockReturnValue('mock-refresh-token');
    
    apiClient.get.mockResolvedValueOnce({
      data: {
        id: 1,
        email: 'test@example.com',
        role: 'user',
      },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
    });

    const logoutButton = screen.getByText('Logout');
    logoutButton.click();

    expect(tokenStorage.clearAll).toHaveBeenCalled();
  });

  test('updates authentication state when tokens are present', async () => {
    tokenStorage.getAccessToken.mockReturnValue('valid-token');
    tokenStorage.getRefreshToken.mockReturnValue('valid-refresh');
    
    apiClient.get.mockResolvedValueOnce({
      data: {
        id: 1,
        email: 'authenticated@example.com',
        first_name: 'Auth',
        last_name: 'User',
        role: 'user',
      },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user-email')).toHaveTextContent('authenticated@example.com');
    });
  });

  test('handles missing refresh token gracefully', async () => {
    tokenStorage.getAccessToken.mockReturnValue('mock-access-token');
    tokenStorage.getRefreshToken.mockReturnValue(null);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated');
    });

    expect(tokenStorage.clearAll).toHaveBeenCalled();
    expect(apiClient.get).not.toHaveBeenCalled();
  });
});






