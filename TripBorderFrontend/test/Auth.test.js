import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Auth from '../src/components/Auth'; // Adjust path as needed
import { useCheckAuthStatusQuery, useLogoutMutation } from '../src/api/authAPI';
import { isTrialActive } from '../src/utility/time';
import { renderWithRedux } from './renderWithRedux';

// Mock dependencies
jest.mock('../src/api/authAPI', () => ({
  authAPI: {
    reducerPath: 'authAPI',
    reducer: (state = { isAuthenticated: false }) => state,
    middleware: () => (next) => (action) => next(action)
  },
  useCheckAuthStatusQuery: jest.fn(),
  useLogoutMutation: jest.fn(),
}));

jest.mock('../src/utility/time', () => ({
  isTrialActive: jest.fn(),
}));

describe('Auth Component', () => {
  let mockRefetch;
  beforeEach(() => {
    mockRefetch = jest.fn();
    useCheckAuthStatusQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });
    useLogoutMutation.mockReturnValue([jest.fn().mockResolvedValue({}), { isLoading: false }]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state', () => {
    useCheckAuthStatusQuery.mockReturnValue({ isLoading: true, refetch: jest.fn() });
    renderWithRedux(<Auth />);
    expect(screen.getByTestId('customLoading')).toBeInTheDocument();
  });

  test('renders error state', () => {
    useCheckAuthStatusQuery.mockReturnValue({ error: { status: 401, message: 'Auth failed' }, refetch: jest.fn() });
    renderWithRedux(<Auth />);
    expect(screen.getByTestId('customError')).toHaveTextContent('401 - Auth failed');
  });

  test('renders login button when not authenticated', () => {
    useCheckAuthStatusQuery.mockReturnValue({ data: { isAuthenticated: false }, refetch: jest.fn() });
    renderWithRedux(<Auth />);
    expect(screen.getByText('To get premium features')).toBeInTheDocument();
    expect(screen.getByTestId('GoogleSignInButton')).toBeInTheDocument();
  });

  test('handles login redirect on click', async () => {
    useCheckAuthStatusQuery.mockReturnValue({ data: { isAuthenticated: false }, refetch: jest.fn() });
    const originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };
    renderWithRedux(<Auth />);
    await userEvent.click(screen.getByTestId('GoogleSignInButton'));
    expect(window.location.href).toContain('/api/auth/google');
    window.location = originalLocation; // Restore after test
  });

  test('renders premium map for admin role', () => {
    useCheckAuthStatusQuery.mockReturnValue({
      data: { isAuthenticated: true, name: 'AdminUser', role: 'admin' },
      refetch: jest.fn(),
    });
    renderWithRedux(<Auth />);
    expect(screen.queryByTestId('button-Upgrade')).not.toBeInTheDocument();
    expect(screen.queryByTestId('button-Sponsors')).not.toBeInTheDocument();
    expect(screen.queryByTestId('button-Mileages')).not.toBeInTheDocument();
    expect(screen.queryByTestId('button-Settings')).not.toBeInTheDocument();
    expect(screen.queryByTestId('button-Logout')).not.toBeInTheDocument();
  });

  test('renders premium map for premium_user role', () => {
    useCheckAuthStatusQuery.mockReturnValue({
      data: { isAuthenticated: true, name: 'PremiumUser', role: 'premium_user' },
      refetch: jest.fn(),
    });
    renderWithRedux(<Auth />);
    expect(screen.queryByTestId('button-Upgrade')).not.toBeInTheDocument();
    expect(screen.queryByTestId('button-Sponsors')).not.toBeInTheDocument();
    expect(screen.queryByTestId('button-Mileages')).not.toBeInTheDocument();
    expect(screen.queryByTestId('button-Settings')).not.toBeInTheDocument();
    expect(screen.queryByTestId('button-Logout')).not.toBeInTheDocument();
  });

  test('renders premium map for user role with active trial', () => {
    useCheckAuthStatusQuery.mockReturnValue({
      data: { isAuthenticated: true, name: 'RegularUser', role: 'user', trial_started_at: '2026-01-01' },
      refetch: jest.fn(),
    });
    isTrialActive.mockReturnValue(true);
    renderWithRedux(<Auth />);
    expect(screen.queryByTestId('button-Upgrade')).not.toBeInTheDocument();
    expect(screen.queryByTestId('button-Sponsors')).not.toBeInTheDocument();
    expect(screen.queryByTestId('button-Mileages')).not.toBeInTheDocument();
    expect(screen.queryByTestId('button-Settings')).not.toBeInTheDocument();
    expect(screen.queryByTestId('button-Logout')).not.toBeInTheDocument();
  });

  test('renders map for user role without active trial', () => {
    useCheckAuthStatusQuery.mockReturnValue({
      data: { isAuthenticated: true, name: 'RegularUser', role: 'user', trial_started_at: '2023-01-01' },
      refetch: jest.fn(),
    });
    isTrialActive.mockReturnValue(false);
    renderWithRedux(<Auth />);
    expect(screen.getByTestId('button-Upgrade')).toBeInTheDocument();
    expect(screen.getByTestId('button-Sponsors')).toBeInTheDocument();
    expect(screen.getByTestId('button-Mileages')).toBeInTheDocument();
    expect(screen.getByTestId('button-Settings')).toBeInTheDocument();
    expect(screen.getByTestId('button-Logout')).toBeInTheDocument();
  });

  test('handles logout on click', async () => {
    useCheckAuthStatusQuery.mockReturnValue({
      data: { isAuthenticated: true, name: 'User', role: 'user', trial_started_at: '2023-01-01' },
      refetch: jest.fn(),
    });
    const mockLogout = jest.fn().mockResolvedValue({});
    useLogoutMutation.mockReturnValue([mockLogout, { isLoading: false }]);
    renderWithRedux(<Auth />);
    await userEvent.click(screen.getByTestId('button-Logout'));
    expect(mockLogout).toHaveBeenCalled();
    await waitFor(() => expect(window.location.pathname).toBe('/'));
  });

  test('refetches on auth success param and cleans URL', () => {
    renderWithRedux(<Auth />);
    expect(mockRefetch).toHaveBeenCalled();
    expect(window.location.search).toBe('');
  });
});
