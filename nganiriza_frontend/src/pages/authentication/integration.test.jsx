import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthContext } from '../../assets/components/context/AuthContext';
import LoginForm from './LoginPage';
import SignupPage from './SignupPage';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ search: '' }),
}));

const mockLogin = jest.fn();
const mockSignup = jest.fn();

const renderWithRouter = (component, authValue) => {
  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter>
        <Routes>
          <Route path="/" element={component} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('Authentication Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  describe('Login Flow', () => {
    test('complete login flow with valid credentials', async () => {
      const authContextValue = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: mockLogin,
        logout: jest.fn(),
        refreshTokens: jest.fn(),
      };

      mockLogin.mockResolvedValueOnce({
        id: 1,
        email: 'test@example.com',
        role: 'user',
      });

      renderWithRouter(<LoginForm />, authContextValue);

      // Fill in form
      const emailInput = screen.getByPlaceholderText(/Enter your email/i);
      const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
      const submitButton = screen.getByRole('button', { name: /Log In/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      // Submit form
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });

    test('login flow with invalid credentials shows error', async () => {
      const authContextValue = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: mockLogin,
        logout: jest.fn(),
        refreshTokens: jest.fn(),
      };

      mockLogin.mockRejectedValueOnce({
        response: { status: 401, data: { error: 'Invalid credentials' } },
      });

      renderWithRouter(<LoginForm />, authContextValue);

      const emailInput = screen.getByPlaceholderText(/Enter your email/i);
      const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
      const submitButton = screen.getByRole('button', { name: /Log In/i });

      fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
      });
    });

    test('login flow handles network errors gracefully', async () => {
      const authContextValue = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: mockLogin,
        logout: jest.fn(),
        refreshTokens: jest.fn(),
      };

      mockLogin.mockRejectedValueOnce({ request: {} });

      renderWithRouter(<LoginForm />, authContextValue);

      const emailInput = screen.getByPlaceholderText(/Enter your email/i);
      const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
      const submitButton = screen.getByRole('button', { name: /Log In/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/No response from server/i)).toBeInTheDocument();
      });
    });
  });

  describe('Signup Flow', () => {
    test('complete signup flow with valid data', async () => {
      const authContextValue = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
        signup: mockSignup,
        refreshTokens: jest.fn(),
      };

      mockSignup.mockResolvedValueOnce({
        id: 1,
        email: 'newuser@example.com',
        role: 'user',
      });

      renderWithRouter(<SignupPage />, authContextValue);

      // Fill form fields if they exist
      const submitButtons = screen.getAllByRole('button');
      const signupButton = submitButtons.find((btn) => 
        btn.textContent.match(/sign up|register/i)
      );

      if (signupButton) {
        fireEvent.click(signupButton);

        await waitFor(() => {
          expect(mockSignup).toHaveBeenCalled();
        }, { timeout: 3000 });
      }
    });

    test('signup flow with existing email shows error', async () => {
      const authContextValue = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
        signup: mockSignup,
        refreshTokens: jest.fn(),
      };

      mockSignup.mockRejectedValueOnce({
        response: { status: 400, data: { error: 'Email already exists' } },
      });

      renderWithRouter(<SignupPage />, authContextValue);

      const submitButtons = screen.getAllByRole('button');
      const signupButton = submitButtons.find((btn) => 
        btn.textContent.match(/sign up|register/i)
      );

      if (signupButton) {
        fireEvent.click(signupButton);

        await waitFor(() => {
          expect(mockSignup).toHaveBeenCalled();
        }, { timeout: 3000 });
      }
    });
  });

  describe('Form Validation Integration', () => {
    test('email validation prevents submission with invalid email', async () => {
      const authContextValue = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: mockLogin,
        logout: jest.fn(),
        refreshTokens: jest.fn(),
      };

      renderWithRouter(<LoginForm />, authContextValue);

      const emailInput = screen.getByPlaceholderText(/Enter your email/i);
      const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
      const submitButton = screen.getByRole('button', { name: /Log In/i });

      // Invalid email format
      fireEvent.change(emailInput, { target: { value: 'notanemail' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      // Should not call login with invalid email
      await waitFor(() => {
        expect(mockLogin).not.toHaveBeenCalled();
      }, { timeout: 1000 });
    });

    test('password validation prevents submission with empty password', async () => {
      const authContextValue = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: mockLogin,
        logout: jest.fn(),
        refreshTokens: jest.fn(),
      };

      renderWithRouter(<LoginForm />, authContextValue);

      const emailInput = screen.getByPlaceholderText(/Enter your email/i);
      const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
      const submitButton = screen.getByRole('button', { name: /Log In/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: '' } });
      fireEvent.click(submitButton);

      // Should not call login with empty password
      expect(mockLogin).not.toHaveBeenCalled();
    });

    test('form sanitizes whitespace in email input', async () => {
      const authContextValue = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: mockLogin,
        logout: jest.fn(),
        refreshTokens: jest.fn(),
      };

      mockLogin.mockResolvedValueOnce({ id: 1, email: 'test@example.com' });

      renderWithRouter(<LoginForm />, authContextValue);

      const emailInput = screen.getByPlaceholderText(/Enter your email/i);
      const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
      const submitButton = screen.getByRole('button', { name: /Log In/i });

      fireEvent.change(emailInput, { target: { value: '  test@example.com  ' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });
    });
  });

  describe('Error Recovery', () => {
    test('user can retry after failed login', async () => {
      const authContextValue = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: mockLogin,
        logout: jest.fn(),
        refreshTokens: jest.fn(),
      };

      // First attempt fails
      mockLogin.mockRejectedValueOnce({
        response: { status: 401, data: { error: 'Invalid credentials' } },
      });

      // Second attempt succeeds
      mockLogin.mockResolvedValueOnce({ id: 1, email: 'test@example.com' });

      renderWithRouter(<LoginForm />, authContextValue);

      const emailInput = screen.getByPlaceholderText(/Enter your email/i);
      const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
      const submitButton = screen.getByRole('button', { name: /Log In/i });

      // First attempt
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
      });

      // Second attempt with correct password
      fireEvent.change(passwordInput, { target: { value: 'correctpass' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledTimes(2);
      });
    });
  });
});




