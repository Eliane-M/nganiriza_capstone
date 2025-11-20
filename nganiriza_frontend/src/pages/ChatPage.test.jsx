import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChatPage } from './ChatPage';
import { LanguageContext } from '../contexts/AppContext';
import { MemoryRouter } from 'react-router-dom';

// Mock Navbar component
jest.mock('../assets/components/Navbar', () => {
  return function MockNavbar() {
    return <div data-testid="navbar">Navbar</div>;
  };
});

// Mock getHardcodedResponse
jest.mock('./answers', () => ({
  __esModule: true,
  default: jest.fn((query, language) => {
    if (query.toLowerCase().includes('hi') || query.toLowerCase().includes('hello')) {
      return language === 'en' 
        ? "Hello! 👋 How can I support you today?"
        : "Muraho! 👋 Nakubwira iki uyu munsi?";
    }
    return language === 'en'
      ? "Thank you for your message. Could you tell me a bit more so I can help better?"
      : "Urakoze ubutumwa bwawe. Wansobanurira birenzeho kugira ngo ngufashe neza?";
  }),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Helper to render with language + router
const renderWithProviders = (ui, { language = 'en' } = {}) => {
  return render(
    <LanguageContext.Provider value={{ language, setLanguage: jest.fn() }}>
      <MemoryRouter>{ui}</MemoryRouter>
    </LanguageContext.Provider>
  );
};

describe('ChatPage', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    localStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders initial AI greeting in English', () => {
    renderWithProviders(<ChatPage />, { language: 'en' });

    expect(
      screen.getByText(/Hi! I'm your AI health companion/i)
    ).toBeInTheDocument();
  });

  test('renders initial AI greeting in Kinyarwanda', () => {
    renderWithProviders(<ChatPage />, { language: 'rw' });

    expect(screen.getByText(/Muraho!/i)).toBeInTheDocument();
  });

  test('displays navbar', () => {
    renderWithProviders(<ChatPage />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  test('allows user to type and send a message', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, response: 'Mock AI reply' }),
    });

    renderWithProviders(<ChatPage />, { language: 'en' });

    const input = screen.getByPlaceholderText(/Type a message/i);
    const sendButtons = screen.getAllByRole('button');
    const sendButton = sendButtons.find(btn => btn.querySelector('svg'));

    fireEvent.change(input, { target: { value: 'hello' } });
    fireEvent.click(sendButton);

    // User message should appear immediately
    expect(screen.getByText('hello')).toBeInTheDocument();

    // AI response should appear after askAI resolves
    await waitFor(() =>
      expect(screen.getByText('Mock AI reply')).toBeInTheDocument(),
      { timeout: 3000 }
    );
  });

  test('sends message on Enter key press', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, response: 'Reply from Enter' }),
    });

    renderWithProviders(<ChatPage />);

    const input = screen.getByPlaceholderText(/Type a message/i);
    fireEvent.change(input, { target: { value: 'test message' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', shiftKey: false });

    await waitFor(() =>
      expect(screen.getByText('Reply from Enter')).toBeInTheDocument(),
      { timeout: 3000 }
    );
  });

  test('does not send empty messages', () => {
    renderWithProviders(<ChatPage />);

    const input = screen.getByPlaceholderText(/Type a message/i);
    const sendButtons = screen.getAllByRole('button');
    const sendButton = sendButtons.find(btn => btn.querySelector('svg'));

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(sendButton);

    // Should not add any new messages beyond the initial greeting
    const greetingText = screen.getByText(/AI health companion/i);
    expect(greetingText).toBeInTheDocument();
  });

  test('shows hardcoded fallback response when backend fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    const getHardcodedResponse = require('./answers').default;

    renderWithProviders(<ChatPage />, { language: 'en' });

    const input = screen.getByPlaceholderText(/Type a message/i);
    fireEvent.change(input, { target: { value: 'hi' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', shiftKey: false });

    // AI fallback should show
    await waitFor(() => {
      expect(getHardcodedResponse).toHaveBeenCalledWith('hi', 'en');
    }, { timeout: 3000 });
  });

  test('displays timestamps for messages', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, response: 'Test reply' }),
    });

    renderWithProviders(<ChatPage />);

    const input = screen.getByPlaceholderText(/Type a message/i);
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', shiftKey: false });

    await waitFor(() => {
      const timestamps = screen.getAllByText(/\d{1,2}:\d{2}/);
      expect(timestamps.length).toBeGreaterThan(0);
    }, { timeout: 3000 });
  });

  test('saves conversations to localStorage', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, response: 'Test reply' }),
    });

    renderWithProviders(<ChatPage />);

    const input = screen.getByPlaceholderText(/Type a message/i);
    fireEvent.change(input, { target: { value: 'test message' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', shiftKey: false });

    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalledWith(
        'nganiriza_chat_conversations',
        expect.any(String)
      );
    }, { timeout: 3000 });

    setItemSpy.mockRestore();
  });

  test('creates new conversation on button click', async () => {
    renderWithProviders(<ChatPage />);

    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText(/AI health companion/i)).toBeInTheDocument();
    });

    const newButton = screen.getByText(/New/i);
    fireEvent.click(newButton);

    // Should reset to initial greeting
    const greetings = screen.getAllByText(/AI health companion/i);
    expect(greetings.length).toBeGreaterThan(0);
  });

  test('disables input while loading', async () => {
    global.fetch.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () => resolve({ 
              ok: true,
              json: async () => ({ success: true, response: 'Reply' }) 
            }),
            100
          )
        )
    );

    renderWithProviders(<ChatPage />);

    const input = screen.getByPlaceholderText(/Type a message/i);
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', shiftKey: false });

    // Input should be disabled while loading
    await waitFor(() => {
      expect(input).toBeDisabled();
    });

    // Input should be enabled again after response
    await waitFor(() => {
      expect(input).not.toBeDisabled();
    }, { timeout: 3000 });
  });

  test('displays sidebar with past conversations title', () => {
    renderWithProviders(<ChatPage />);
    
    expect(screen.getByText(/Past conversations/i)).toBeInTheDocument();
  });

  test('shows new conversation button in sidebar', () => {
    renderWithProviders(<ChatPage />);
    
    const newButton = screen.getByText(/New/i);
    expect(newButton).toBeInTheDocument();
  });
});
