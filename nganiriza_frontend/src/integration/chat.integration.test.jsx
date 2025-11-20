import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ChatPage } from '../pages/ChatPage';
import { LanguageContext } from '../contexts/AppContext';

// Mock Navbar
jest.mock('../assets/components/Navbar', () => {
  return function MockNavbar() {
    return <div data-testid="navbar">Navbar</div>;
  };
});

// Mock answers module
jest.mock('../pages/answers', () => ({
  __esModule: true,
  default: jest.fn((query, language) => {
    if (query.toLowerCase().includes('malaria')) {
      return language === 'en'
        ? 'Malaria symptoms include fever, chills, and headache.'
        : 'Ibimenyetso bya malariya birimo umuriro, guhinda, n\'ububabare bw\'umutwe.';
    }
    return language === 'en'
      ? 'I can help you with health information.'
      : 'Nshobora kukubwira ku bijyanye n\'ubuzima.';
  }),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderWithProviders = (ui, { language = 'en' } = {}) => {
  return render(
    <LanguageContext.Provider value={{ language, setLanguage: jest.fn() }}>
      <MemoryRouter>{ui}</MemoryRouter>
    </LanguageContext.Provider>
  );
};

describe('Chat Integration Tests', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    localStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Complete Chat Flow', () => {
    test('user can send message and receive response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          response: 'Malaria symptoms include fever, chills, and headache.',
        }),
      });

      renderWithProviders(<ChatPage />, { language: 'en' });

      const input = screen.getByPlaceholderText(/Type a message/i);
      const sendButtons = screen.getAllByRole('button');
      const sendButton = sendButtons.find((btn) => btn.querySelector('svg'));

      // Type message
      fireEvent.change(input, { target: { value: 'What are malaria symptoms?' } });

      // Send message
      fireEvent.click(sendButton);

      // User message appears
      expect(screen.getByText('What are malaria symptoms?')).toBeInTheDocument();

      // AI response appears
      await waitFor(
        () => {
          expect(
            screen.getByText(/Malaria symptoms include fever/i)
          ).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    test('user can send multiple messages in sequence', async () => {
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, response: 'First response' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, response: 'Second response' }),
        });

      renderWithProviders(<ChatPage />);

      const input = screen.getByPlaceholderText(/Type a message/i);
      const sendButtons = screen.getAllByRole('button');
      const sendButton = sendButtons.find((btn) => btn.querySelector('svg'));

      // First message
      fireEvent.change(input, { target: { value: 'First message' } });
      fireEvent.click(sendButton);

      await waitFor(() =>
        expect(screen.getByText('First response')).toBeInTheDocument()
      );

      // Second message
      fireEvent.change(input, { target: { value: 'Second message' } });
      fireEvent.click(sendButton);

      await waitFor(() =>
        expect(screen.getByText('Second response')).toBeInTheDocument()
      );
    });

    test('conversation persists in localStorage', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, response: 'Test response' }),
      });

      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

      renderWithProviders(<ChatPage />);

      const input = screen.getByPlaceholderText(/Type a message/i);
      const sendButtons = screen.getAllByRole('button');
      const sendButton = sendButtons.find((btn) => btn.querySelector('svg'));

      fireEvent.change(input, { target: { value: 'test message' } });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(setItemSpy).toHaveBeenCalledWith(
          'nganiriza_chat_conversations',
          expect.any(String)
        );
      });

      setItemSpy.mockRestore();
    });
  });

  describe('Language Switching', () => {
    test('chat works in English', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          response: 'Malaria symptoms include fever.',
        }),
      });

      renderWithProviders(<ChatPage />, { language: 'en' });

      expect(screen.getByText(/AI health companion/i)).toBeInTheDocument();

      const input = screen.getByPlaceholderText(/Type a message/i);
      const sendButtons = screen.getAllByRole('button');
      const sendButton = sendButtons.find((btn) => btn.querySelector('svg'));

      fireEvent.change(input, { target: { value: 'malaria symptoms' } });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText(/Malaria symptoms/i)).toBeInTheDocument();
      });
    });

    test('chat works in Kinyarwanda', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          response: 'Ibimenyetso bya malariya',
        }),
      });

      renderWithProviders(<ChatPage />, { language: 'rw' });

      expect(screen.getByText(/Muraho!/i)).toBeInTheDocument();

      const input = screen.getByPlaceholderText(/Type a message/i);
      const sendButtons = screen.getAllByRole('button');
      const sendButton = sendButtons.find((btn) => btn.querySelector('svg'));

      fireEvent.change(input, { target: { value: 'ibimenyetso bya malariya' } });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText(/Ibimenyetso/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling Integration', () => {
    test('shows fallback response when backend fails', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const getHardcodedResponse = require('../pages/answers').default;

      renderWithProviders(<ChatPage />, { language: 'en' });

      const input = screen.getByPlaceholderText(/Type a message/i);
      fireEvent.change(input, { target: { value: 'malaria' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', shiftKey: false });

      await waitFor(
        () => {
          expect(getHardcodedResponse).toHaveBeenCalledWith('malaria', 'en');
        },
        { timeout: 3000 }
      );
    });

    test('handles slow network gracefully', async () => {
      global.fetch.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ success: true, response: 'Delayed response' }),
                }),
              2000
            )
          )
      );

      renderWithProviders(<ChatPage />);

      const input = screen.getByPlaceholderText(/Type a message/i);
      const sendButtons = screen.getAllByRole('button');
      const sendButton = sendButtons.find((btn) => btn.querySelector('svg'));

      fireEvent.change(input, { target: { value: 'test' } });
      fireEvent.click(sendButton);

      // Input should be disabled while loading
      await waitFor(() => {
        expect(input).toBeDisabled();
      });

      // Response eventually appears
      await waitFor(
        () => {
          expect(screen.getByText('Delayed response')).toBeInTheDocument();
        },
        { timeout: 5000 }
      );
    });
  });

  describe('Input Validation Integration', () => {
    test('does not send empty messages', () => {
      renderWithProviders(<ChatPage />);

      const input = screen.getByPlaceholderText(/Type a message/i);
      const sendButtons = screen.getAllByRole('button');
      const sendButton = sendButtons.find((btn) => btn.querySelector('svg'));

      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.click(sendButton);

      // Should not add any new messages
      const greetingText = screen.getByText(/AI health companion/i);
      expect(greetingText).toBeInTheDocument();
    });

    test('trims whitespace from messages', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, response: 'Response' }),
      });

      renderWithProviders(<ChatPage />);

      const input = screen.getByPlaceholderText(/Type a message/i);
      const sendButtons = screen.getAllByRole('button');
      const sendButton = sendButtons.find((btn) => btn.querySelector('svg'));

      fireEvent.change(input, { target: { value: '  hello  ' } });
      fireEvent.click(sendButton);

      // Message should appear trimmed
      await waitFor(() => {
        expect(screen.getByText('hello')).toBeInTheDocument();
      });
    });

    test('handles special characters in messages', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, response: 'Handled' }),
      });

      renderWithProviders(<ChatPage />);

      const input = screen.getByPlaceholderText(/Type a message/i);
      const sendButtons = screen.getAllByRole('button');
      const sendButton = sendButtons.find((btn) => btn.querySelector('svg'));

      const specialMessage = "What's <script>alert('test')</script>?";
      fireEvent.change(input, { target: { value: specialMessage } });
      fireEvent.click(sendButton);

      // Should handle without breaking
      await waitFor(() => {
        expect(screen.getByText('Handled')).toBeInTheDocument();
      });
    });
  });

  describe('Conversation Management', () => {
    test('user can create new conversation', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, response: 'Response' }),
      });

      renderWithProviders(<ChatPage />);

      const input = screen.getByPlaceholderText(/Type a message/i);
      const sendButtons = screen.getAllByRole('button');
      const sendButton = sendButtons.find((btn) => btn.querySelector('svg'));

      // Send a message
      fireEvent.change(input, { target: { value: 'first message' } });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText('first message')).toBeInTheDocument();
      });

      // Start new conversation
      const newButton = screen.getByText(/New/i);
      fireEvent.click(newButton);

      // Should reset to initial greeting
      await waitFor(() => {
        const greetings = screen.getAllByText(/AI health companion/i);
        expect(greetings.length).toBeGreaterThan(0);
      });
    });
  });
});


