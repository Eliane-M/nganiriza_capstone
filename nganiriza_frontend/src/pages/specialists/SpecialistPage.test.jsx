import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SpecialistPage } from './SpecialistPage';
import { AuthContext } from '../../assets/components/context/AuthContext';
import apiClient from '../../utils/apiClient';

// Mock apiClient
jest.mock('../../utils/apiClient');

const mockSpecialists = [
  {
    id: 1,
    name: 'Dr. Jane Smith',
    specialty: 'gynecology',
    specialty_display: 'Gynecology',
    years_of_experience: 10,
    consultation_fee: 50000,
    languages_spoken: ['English', 'Kinyarwanda'],
    availability: 'Mon-Fri 9AM-5PM',
    bio: 'Experienced gynecologist specializing in women\'s health',
    position: [-1.9437, 30.0594],
  },
  {
    id: 2,
    name: 'Dr. John Doe',
    specialty: 'mental',
    specialty_display: 'Mental Health',
    years_of_experience: 8,
    consultation_fee: 40000,
    languages_spoken: ['English', 'French'],
    availability: 'Mon-Wed 10AM-4PM',
    bio: 'Mental health counselor with focus on adolescent health',
    position: [-1.9507, 30.0626],
  },
];

const renderWithProviders = (ui, { isAuthenticated = true } = {}) => {
  return render(
    <AuthContext.Provider
      value={{
        user: isAuthenticated ? { id: 1, email: 'test@example.com', role: 'user' } : null,
        isAuthenticated,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
        refreshTokens: jest.fn(),
      }}
    >
      <MemoryRouter>{ui}</MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('SpecialistPage - Listing Specialists', () => {
  beforeEach(() => {
    apiClient.get.mockResolvedValue({ data: mockSpecialists });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders page title', async () => {
    renderWithProviders(<SpecialistPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Connect with trusted/i)).toBeInTheDocument();
    });
  });

  test('fetches and displays specialists on mount', async () => {
    renderWithProviders(<SpecialistPage />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Dr. John Doe')).toBeInTheDocument();
    });

    expect(apiClient.get).toHaveBeenCalledWith(
      '/api/specialists/',
      expect.any(Object)
    );
  });

  test('displays specialist details correctly', async () => {
    renderWithProviders(<SpecialistPage />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument();
      expect(screen.getByText(/Gynecology/i)).toBeInTheDocument();
      expect(screen.getByText(/10.*years/i)).toBeInTheDocument();
      expect(screen.getByText(/50000/)).toBeInTheDocument();
    });
  });

  test('allows searching specialists by name', async () => {
    renderWithProviders(<SpecialistPage />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search by name or specialty/i);
    fireEvent.change(searchInput, { target: { value: 'Jane' } });

    expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument();
    expect(screen.queryByText('Dr. John Doe')).not.toBeInTheDocument();
  });

  test('filters specialists by specialty', async () => {
    renderWithProviders(<SpecialistPage />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument();
    });

    const mentalHealthButton = screen.getByText('Mental Health');
    fireEvent.click(mentalHealthButton);

    expect(screen.queryByText('Dr. Jane Smith')).not.toBeInTheDocument();
    expect(screen.getByText('Dr. John Doe')).toBeInTheDocument();
  });

  test('shows "All Specialists" when filter is reset', async () => {
    renderWithProviders(<SpecialistPage />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument();
    });

    // Filter first
    const gynecologyButton = screen.getByText('Gynecology');
    fireEvent.click(gynecologyButton);

    expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument();
    expect(screen.queryByText('Dr. John Doe')).not.toBeInTheDocument();

    // Reset filter
    const allButton = screen.getByText('All Specialists');
    fireEvent.click(allButton);

    expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Dr. John Doe')).toBeInTheDocument();
  });

  test('displays loading state', () => {
    apiClient.get.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    renderWithProviders(<SpecialistPage />);
    expect(screen.getByText(/Loading specialists/i)).toBeInTheDocument();
  });

  test('displays error state on fetch failure', async () => {
    apiClient.get.mockRejectedValue(new Error('Network error'));

    renderWithProviders(<SpecialistPage />);

    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });

  test('shows retry button on error', async () => {
    apiClient.get.mockRejectedValueOnce(new Error('Network error'));

    renderWithProviders(<SpecialistPage />);

    await waitFor(() => {
      expect(screen.getByText(/Retry/i)).toBeInTheDocument();
    });

    apiClient.get.mockResolvedValueOnce({ data: mockSpecialists });

    const retryButton = screen.getByText(/Retry/i);
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument();
    });
  });

  test('opens specialist detail view on card click', async () => {
    renderWithProviders(<SpecialistPage />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument();
    });

    const card = screen.getByText('Dr. Jane Smith').closest('.specialist-card-v2');
    fireEvent.click(card);

    await waitFor(() => {
      expect(screen.getByText(/Back to specialists/i)).toBeInTheDocument();
      expect(screen.getByText(/Request an appointment/i)).toBeInTheDocument();
    });
  });
});

describe('SpecialistPage - Booking Appointments', () => {
  beforeEach(() => {
    apiClient.get.mockResolvedValue({ data: mockSpecialists });
    apiClient.post.mockResolvedValue({ data: { success: true } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('shows appointment form in detail view', async () => {
    renderWithProviders(<SpecialistPage />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument();
    });

    const card = screen.getByText('Dr. Jane Smith').closest('.specialist-card-v2');
    fireEvent.click(card);

    await waitFor(() => {
      expect(screen.getByText(/Request an appointment/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Preferred date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Preferred time/i)).toBeInTheDocument();
    });
  });

  test('allows booking an appointment when authenticated', async () => {
    renderWithProviders(<SpecialistPage />, { isAuthenticated: true });

    await waitFor(() => {
      expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument();
    });

    const card = screen.getByText('Dr. Jane Smith').closest('.specialist-card-v2');
    fireEvent.click(card);

    await waitFor(() => {
      expect(screen.getByText(/Request an appointment/i)).toBeInTheDocument();
    });

    const dateInput = screen.getByLabelText(/Preferred date/i);
    const timeInput = screen.getByLabelText(/Preferred time/i);
    const notesInput = screen.getByPlaceholderText(/Share any symptoms/i);

    fireEvent.change(dateInput, { target: { value: '2024-12-25' } });
    fireEvent.change(timeInput, { target: { value: '10:00' } });
    fireEvent.change(notesInput, { target: { value: 'Routine checkup' } });

    const submitButton = screen.getByText(/Send appointment request/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/specialists/appointments/create/',
        expect.objectContaining({
          specialist: 1,
          appointment_date: '2024-12-25',
          appointment_time: '10:00',
          notes: 'Routine checkup',
        })
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/Appointment request sent successfully/i)).toBeInTheDocument();
    });
  });

  test('prevents booking without authentication', async () => {
    renderWithProviders(<SpecialistPage />, { isAuthenticated: false });

    await waitFor(() => {
      expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument();
    });

    const card = screen.getByText('Dr. Jane Smith').closest('.specialist-card-v2');
    fireEvent.click(card);

    await waitFor(() => {
      expect(screen.getByText(/Request an appointment/i)).toBeInTheDocument();
    });

    const dateInput = screen.getByLabelText(/Preferred date/i);
    const timeInput = screen.getByLabelText(/Preferred time/i);

    fireEvent.change(dateInput, { target: { value: '2024-12-25' } });
    fireEvent.change(timeInput, { target: { value: '10:00' } });

    const submitButton = screen.getByText(/Send appointment request/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Please sign in to request an appointment/i)).toBeInTheDocument();
    });

    expect(apiClient.post).not.toHaveBeenCalled();
  });

  test('validates required fields before submission', async () => {
    renderWithProviders(<SpecialistPage />, { isAuthenticated: true });

    await waitFor(() => {
      expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument();
    });

    const card = screen.getByText('Dr. Jane Smith').closest('.specialist-card-v2');
    fireEvent.click(card);

    await waitFor(() => {
      expect(screen.getByText(/Request an appointment/i)).toBeInTheDocument();
    });

    const submitButton = screen.getByText(/Send appointment request/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Please select a date and time/i)).toBeInTheDocument();
    });

    expect(apiClient.post).not.toHaveBeenCalled();
  });

  test('handles appointment booking errors', async () => {
    apiClient.post.mockRejectedValueOnce({
      response: { data: { error: 'Slot not available' } },
    });

    renderWithProviders(<SpecialistPage />, { isAuthenticated: true });

    await waitFor(() => {
      expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument();
    });

    const card = screen.getByText('Dr. Jane Smith').closest('.specialist-card-v2');
    fireEvent.click(card);

    await waitFor(() => {
      expect(screen.getByText(/Request an appointment/i)).toBeInTheDocument();
    });

    const dateInput = screen.getByLabelText(/Preferred date/i);
    const timeInput = screen.getByLabelText(/Preferred time/i);

    fireEvent.change(dateInput, { target: { value: '2024-12-25' } });
    fireEvent.change(timeInput, { target: { value: '10:00' } });

    const submitButton = screen.getByText(/Send appointment request/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Slot not available/i)).toBeInTheDocument();
    });
  });

  test('clears form after successful booking', async () => {
    renderWithProviders(<SpecialistPage />, { isAuthenticated: true });

    await waitFor(() => {
      expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument();
    });

    const card = screen.getByText('Dr. Jane Smith').closest('.specialist-card-v2');
    fireEvent.click(card);

    await waitFor(() => {
      expect(screen.getByText(/Request an appointment/i)).toBeInTheDocument();
    });

    const dateInput = screen.getByLabelText(/Preferred date/i);
    const timeInput = screen.getByLabelText(/Preferred time/i);
    const notesInput = screen.getByPlaceholderText(/Share any symptoms/i);

    fireEvent.change(dateInput, { target: { value: '2024-12-25' } });
    fireEvent.change(timeInput, { target: { value: '10:00' } });
    fireEvent.change(notesInput, { target: { value: 'Test notes' } });

    const submitButton = screen.getByText(/Send appointment request/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Appointment request sent successfully/i)).toBeInTheDocument();
    });

    // Form should be cleared
    expect(dateInput.value).toBe('');
    expect(timeInput.value).toBe('');
    expect(notesInput.value).toBe('');
  });

  test('allows sending messages to specialist', async () => {
    renderWithProviders(<SpecialistPage />, { isAuthenticated: true });

    await waitFor(() => {
      expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument();
    });

    const card = screen.getByText('Dr. Jane Smith').closest('.specialist-card-v2');
    fireEvent.click(card);

    await waitFor(() => {
      expect(screen.getByText(/Message this specialist/i)).toBeInTheDocument();
    });

    const subjectInput = screen.getByPlaceholderText(/Short summary/i);
    const messageInput = screen.getByPlaceholderText(/Introduce yourself/i);

    fireEvent.change(subjectInput, { target: { value: 'Consultation inquiry' } });
    fireEvent.change(messageInput, { target: { value: 'I would like to schedule a consultation' } });

    const sendButton = screen.getAllByText(/Send/i).find(btn => 
      btn.closest('form')?.querySelector('[placeholder*="Introduce"]')
    );
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith(
        '/api/specialists/messages/create/',
        expect.objectContaining({
          specialist: 1,
          subject: 'Consultation inquiry',
          message: 'I would like to schedule a consultation',
        })
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/Message delivered to the specialist/i)).toBeInTheDocument();
    });
  });
});



