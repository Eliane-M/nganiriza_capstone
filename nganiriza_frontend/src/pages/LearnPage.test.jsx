import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LearnPage from './LearnPage';
import { LanguageContext } from '../contexts/AppContext';
import { AuthContext } from '../assets/components/context/AuthContext';

// Mock Navbar component
jest.mock('../assets/components/Navbar', () => {
  return function MockNavbar() {
    return <div data-testid="navbar">Navbar</div>;
  };
});

// Mock apiClient instead of axios
jest.mock('../utils/apiClient');
const apiClient = require('../utils/apiClient').default;

const mockArticles = [
  {
    id: 1,
    title: 'Understanding Puberty',
    excerpt: 'Learn about the physical and emotional changes during puberty...',
    tags: ['puberty'],
    read_time: 5,
  },
  {
    id: 2,
    title: 'Healthy Relationships',
    excerpt: 'Building strong and respectful relationships...',
    tags: ['relationships'],
    read_time: 7,
  },
  {
    id: 3,
    title: 'Contraception Methods',
    excerpt: 'Understanding different contraception options...',
    tags: ['contraception'],
    read_time: 10,
  },
];

const renderWithProviders = (
  ui,
  { language = 'en', isAuthenticated = true } = {}
) => {
  return render(
    <AuthContext.Provider
      value={{
        user: isAuthenticated ? { id: 1, email: 'test@example.com' } : null,
        isAuthenticated,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
        refreshTokens: jest.fn(),
      }}
    >
      <LanguageContext.Provider value={{ language, setLanguage: jest.fn() }}>
        <MemoryRouter>{ui}</MemoryRouter>
      </LanguageContext.Provider>
    </AuthContext.Provider>
  );
};

describe('LearnPage', () => {
  beforeEach(() => {
    apiClient.get.mockResolvedValue({ data: { results: mockArticles } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the page title', async () => {
    renderWithProviders(<LearnPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Learn About Health/i)).toBeInTheDocument();
    });
  });

  test('displays navbar', () => {
    renderWithProviders(<LearnPage />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  test('fetches and displays articles on mount', async () => {
    renderWithProviders(<LearnPage />);

    await waitFor(() => {
      expect(screen.getByText('Understanding Puberty')).toBeInTheDocument();
      expect(screen.getByText('Healthy Relationships')).toBeInTheDocument();
      expect(screen.getByText('Contraception Methods')).toBeInTheDocument();
    });

    expect(apiClient.get).toHaveBeenCalledWith(
      expect.stringContaining('/api/dashboard/articles/'),
      expect.any(Object)
    );
  });

  test('allows searching articles', async () => {
    renderWithProviders(<LearnPage />);

    await waitFor(() => {
      expect(screen.getByText('Understanding Puberty')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search articles/i);
    fireEvent.change(searchInput, { target: { value: 'puberty' } });

    expect(screen.getByText('Understanding Puberty')).toBeInTheDocument();
    expect(screen.queryByText('Healthy Relationships')).not.toBeInTheDocument();
  });

  test('filters articles by tag', async () => {
    renderWithProviders(<LearnPage />);

    await waitFor(() => {
      expect(screen.getByText('Understanding Puberty')).toBeInTheDocument();
    });

    const relationshipsButton = screen.getByText('Relationships');
    fireEvent.click(relationshipsButton);

    expect(screen.queryByText('Understanding Puberty')).not.toBeInTheDocument();
    expect(screen.getByText('Healthy Relationships')).toBeInTheDocument();
  });

  test('resets filter when "All Topics" is clicked', async () => {
    renderWithProviders(<LearnPage />);

    await waitFor(() => {
      expect(screen.getByText('Understanding Puberty')).toBeInTheDocument();
    });

    // First filter to a specific tag
    const pubertyButton = screen.getByText('Puberty');
    fireEvent.click(pubertyButton);

    expect(screen.getByText('Understanding Puberty')).toBeInTheDocument();
    expect(screen.queryByText('Healthy Relationships')).not.toBeInTheDocument();

    // Then click "All Topics"
    const allTopicsButton = screen.getByText('All Topics');
    fireEvent.click(allTopicsButton);

    expect(screen.getByText('Understanding Puberty')).toBeInTheDocument();
    expect(screen.getByText('Healthy Relationships')).toBeInTheDocument();
  });

  test('displays loading state', () => {
    apiClient.get.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    renderWithProviders(<LearnPage />);
    expect(screen.getByText(/Loading articles/i)).toBeInTheDocument();
  });

  test('displays fallback articles when API fails', async () => {
    apiClient.get.mockRejectedValue(new Error('Network error'));

    renderWithProviders(<LearnPage />);

    await waitFor(() => {
      expect(screen.getByText(/Understanding Puberty/i)).toBeInTheDocument();
    });
  });

  test('displays "no articles found" when search has no results', async () => {
    renderWithProviders(<LearnPage />);

    await waitFor(() => {
      expect(screen.getByText('Understanding Puberty')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search articles/i);
    fireEvent.change(searchInput, { target: { value: 'nonexistent topic xyz' } });

    expect(screen.getByText(/No articles found/i)).toBeInTheDocument();
  });

  test('changes language properly', async () => {
    const { rerender } = renderWithProviders(<LearnPage />, { language: 'en' });

    await waitFor(() => {
      expect(screen.getByText(/Learn About Health/i)).toBeInTheDocument();
    });

    rerender(
      <AuthContext.Provider
        value={{
          user: { id: 1, email: 'test@example.com' },
          isAuthenticated: true,
          isLoading: false,
          login: jest.fn(),
          logout: jest.fn(),
          refreshTokens: jest.fn(),
        }}
      >
        <LanguageContext.Provider
          value={{ language: 'rw', setLanguage: jest.fn() }}
        >
          <MemoryRouter>
            <LearnPage />
          </MemoryRouter>
        </LanguageContext.Provider>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Wige Ku Buzima/i)).toBeInTheDocument();
    });
  });

  test('displays read time for articles', async () => {
    renderWithProviders(<LearnPage />);

    await waitFor(() => {
      expect(screen.getByText(/5.*min read/i)).toBeInTheDocument();
      expect(screen.getByText(/7.*min read/i)).toBeInTheDocument();
    });
  });
});

