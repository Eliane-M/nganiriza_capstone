import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignupPage from './SignupPage';
import apiClient from '../../utils/apiClient';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../utils/apiClient');

const renderSignupPage = () => {
  return render(
    <MemoryRouter>
      <SignupPage />
    </MemoryRouter>
  );
};

describe('SignupPage - Input Validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders signup form with all required fields', () => {
    renderSignupPage();

    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
  });

  test('validates empty first name', async () => {
    renderSignupPage();

    const lastNameInput = screen.getByPlaceholderText(/Enter your last name/i);
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/Create a password/i);
    const confirmInput = screen.getByPlaceholderText(/Confirm your password/i);
    const agreeCheckbox = screen.getByRole('checkbox');
    const submitButton = screen.getByRole('button', { name: /Create Account/i });

    // Fill all except first name
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password123' } });
    fireEvent.click(agreeCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/First name is required/i)).toBeInTheDocument();
    });

    expect(apiClient.post).not.toHaveBeenCalled();
  });

  test('validates empty last name', async () => {
    renderSignupPage();

    const firstNameInput = screen.getByPlaceholderText(/Enter your first name/i);
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/Create a password/i);
    const confirmInput = screen.getByPlaceholderText(/Confirm your password/i);
    const agreeCheckbox = screen.getByRole('checkbox');
    const submitButton = screen.getByRole('button', { name: /Create Account/i });

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password123' } });
    fireEvent.click(agreeCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Last name is required/i)).toBeInTheDocument();
    });

    expect(apiClient.post).not.toHaveBeenCalled();
  });

  test('validates invalid email format', async () => {
    renderSignupPage();

    const firstNameInput = screen.getByPlaceholderText(/Enter your first name/i);
    const lastNameInput = screen.getByPlaceholderText(/Enter your last name/i);
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/Create a password/i);
    const confirmInput = screen.getByPlaceholderText(/Confirm your password/i);
    const agreeCheckbox = screen.getByRole('checkbox');
    const submitButton = screen.getByRole('button', { name: /Create Account/i });

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password123' } });
    fireEvent.click(agreeCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid email/i)).toBeInTheDocument();
    });

    expect(apiClient.post).not.toHaveBeenCalled();
  });

  test('validates password minimum length', async () => {
    renderSignupPage();

    const firstNameInput = screen.getByPlaceholderText(/Enter your first name/i);
    const lastNameInput = screen.getByPlaceholderText(/Enter your last name/i);
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/Create a password/i);
    const confirmInput = screen.getByPlaceholderText(/Confirm your password/i);
    const agreeCheckbox = screen.getByRole('checkbox');
    const submitButton = screen.getByRole('button', { name: /Create Account/i });

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '12345' } }); // Only 5 chars
    fireEvent.change(confirmInput, { target: { value: '12345' } });
    fireEvent.click(agreeCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Min 6 characters/i)).toBeInTheDocument();
    });

    expect(apiClient.post).not.toHaveBeenCalled();
  });

  test('validates password confirmation match', async () => {
    renderSignupPage();

    const firstNameInput = screen.getByPlaceholderText(/Enter your first name/i);
    const lastNameInput = screen.getByPlaceholderText(/Enter your last name/i);
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/Create a password/i);
    const confirmInput = screen.getByPlaceholderText(/Confirm your password/i);
    const agreeCheckbox = screen.getByRole('checkbox');
    const submitButton = screen.getByRole('button', { name: /Create Account/i });

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'different123' } });
    fireEvent.click(agreeCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Passwords don't match/i)).toBeInTheDocument();
    });

    expect(apiClient.post).not.toHaveBeenCalled();
  });

  test('validates terms agreement checkbox', async () => {
    renderSignupPage();

    const firstNameInput = screen.getByPlaceholderText(/Enter your first name/i);
    const lastNameInput = screen.getByPlaceholderText(/Enter your last name/i);
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/Create a password/i);
    const confirmInput = screen.getByPlaceholderText(/Confirm your password/i);
    const submitButton = screen.getByRole('button', { name: /Create Account/i });

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password123' } });
    // Don't check the agreement checkbox
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/You must agree to continue/i)).toBeInTheDocument();
    });

    expect(apiClient.post).not.toHaveBeenCalled();
  });

  test('validates phone number format', async () => {
    renderSignupPage();

    const firstNameInput = screen.getByPlaceholderText(/Enter your first name/i);
    const lastNameInput = screen.getByPlaceholderText(/Enter your last name/i);
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/Create a password/i);
    const confirmInput = screen.getByPlaceholderText(/Confirm your password/i);
    const phoneInput = screen.getByPlaceholderText(/\+250/i);
    const agreeCheckbox = screen.getByRole('checkbox');
    const submitButton = screen.getByRole('button', { name: /Create Account/i });

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password123' } });
    fireEvent.change(phoneInput, { target: { value: '123' } }); // Invalid format
    fireEvent.click(agreeCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid phone number format/i)).toBeInTheDocument();
    });

    expect(apiClient.post).not.toHaveBeenCalled();
  });

  test('accepts valid signup data', async () => {
    apiClient.post.mockResolvedValueOnce({ data: { success: true } });

    renderSignupPage();

    const firstNameInput = screen.getByPlaceholderText(/Enter your first name/i);
    const lastNameInput = screen.getByPlaceholderText(/Enter your last name/i);
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/Create a password/i);
    const confirmInput = screen.getByPlaceholderText(/Confirm your password/i);
    const agreeCheckbox = screen.getByRole('checkbox');
    const submitButton = screen.getByRole('button', { name: /Create Account/i });

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password123' } });
    fireEvent.click(agreeCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          full_name: 'John Doe',
          email: 'test@example.com',
          password: 'password123',
        }),
        expect.any(Object)
      );
    });
  });

  test('displays error for existing email', async () => {
    apiClient.post.mockRejectedValueOnce({
      response: { 
        status: 409, 
        data: { error: 'Email already exists' } 
      },
    });

    renderSignupPage();

    const firstNameInput = screen.getByPlaceholderText(/Enter your first name/i);
    const lastNameInput = screen.getByPlaceholderText(/Enter your last name/i);
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/Create a password/i);
    const confirmInput = screen.getByPlaceholderText(/Confirm your password/i);
    const agreeCheckbox = screen.getByRole('checkbox');
    const submitButton = screen.getByRole('button', { name: /Create Account/i });

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password123' } });
    fireEvent.click(agreeCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Email already exists/i)).toBeInTheDocument();
    });
  });

  test('toggles user type between user and specialist', () => {
    renderSignupPage();

    const userButton = screen.getByRole('button', { name: /^User$/i });
    const specialistButton = screen.getByRole('button', { name: /Specialist/i });

    // Initially user should be selected
    expect(userButton).toHaveClass('active');
    expect(specialistButton).not.toHaveClass('active');

    // Click specialist
    fireEvent.click(specialistButton);
    expect(specialistButton).toHaveClass('active');
    expect(userButton).not.toHaveClass('active');

    // Click user again
    fireEvent.click(userButton);
    expect(userButton).toHaveClass('active');
    expect(specialistButton).not.toHaveClass('active');
  });

  test('disables submit button while loading', async () => {
    apiClient.post.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    renderSignupPage();

    const firstNameInput = screen.getByPlaceholderText(/Enter your first name/i);
    const lastNameInput = screen.getByPlaceholderText(/Enter your last name/i);
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/Create a password/i);
    const confirmInput = screen.getByPlaceholderText(/Confirm your password/i);
    const agreeCheckbox = screen.getByRole('checkbox');
    const submitButton = screen.getByRole('button', { name: /Create Account/i });

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password123' } });
    fireEvent.click(agreeCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  test('shows different error messages for multiple validation failures', async () => {
    renderSignupPage();

    const submitButton = screen.getByRole('button', { name: /Create Account/i });
    
    // Submit without filling anything
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/First name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/You must agree to continue/i)).toBeInTheDocument();
    });
  });
});



