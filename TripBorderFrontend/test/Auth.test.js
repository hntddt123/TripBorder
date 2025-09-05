import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Auth from '../src/components/Auth'; // Adjust path as needed
import { useCheckAuthStatusQuery, useLogoutMutation } from '../src/api/authAPI';
import { isTrialActive } from '../src/utility/time';
import { renderWithRouter } from './renderWithRouter';

// Mock dependencies
jest.mock('../src/api/authAPI', () => ({
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
    renderWithRouter(['/auth'], <Auth />);
    expect(screen.getByTestId('customLoading')).toBeInTheDocument();
  });

  test('renders error state', () => {
    useCheckAuthStatusQuery.mockReturnValue({ error: { status: 401, message: 'Auth failed' }, refetch: jest.fn() });
    renderWithRouter(['/auth'], <Auth />);
    expect(screen.getByTestId('customError')).toHaveTextContent('Status: 401 - Auth failed');
  });

  test('renders login button when not authenticated', () => {
    useCheckAuthStatusQuery.mockReturnValue({ data: { isAuthenticated: false }, refetch: jest.fn() });
    renderWithRouter(['/auth'], <Auth />);
    expect(screen.getByText('Login with following options')).toBeInTheDocument();
    expect(screen.getByTestId('GoogleSignInButton')).toBeInTheDocument();
  });

  test('handles login redirect on click', async () => {
    useCheckAuthStatusQuery.mockReturnValue({ data: { isAuthenticated: false }, refetch: jest.fn() });
    const originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };
    renderWithRouter(['/auth'], <Auth />);
    await userEvent.click(screen.getByTestId('GoogleSignInButton'));
    expect(window.location.href).toContain('/api/auth/google');
    window.location = originalLocation; // Restore after test
  });

  test('renders welcome and buttons for admin role', () => {
    useCheckAuthStatusQuery.mockReturnValue({
      data: { isAuthenticated: true, name: 'AdminUser', role: 'admin' },
      refetch: jest.fn(),
    });
    renderWithRouter(['/auth'], <Auth />);
    expect(screen.getByText('Welcome, AdminUser!')).toBeInTheDocument();
    expect(screen.getByTestId('button-Plan Trip')).toBeInTheDocument();
    expect(screen.getByTestId('button-View Trips')).toBeInTheDocument();
    expect(screen.getByTestId('button-Mileages')).toBeInTheDocument();
    expect(screen.getByTestId('button-Mileage Verification')).toBeInTheDocument();
    expect(screen.getByTestId('button-Database Table')).toBeInTheDocument();
    expect(screen.getByTestId('button-Settings')).toBeInTheDocument();
    expect(screen.getByTestId('button-Disclaimers')).toBeInTheDocument();
    expect(screen.queryByTestId('button-Upgrade')).not.toBeInTheDocument();
    expect(screen.getByTestId('button-Logout')).toBeInTheDocument();
  });

  test('renders welcome and buttons for premium_user role', () => {
    useCheckAuthStatusQuery.mockReturnValue({
      data: { isAuthenticated: true, name: 'PremiumUser', role: 'premium_user' },
      refetch: jest.fn(),
    });
    renderWithRouter(['/auth'], <Auth />);
    expect(screen.getByText('Welcome, PremiumUser!')).toBeInTheDocument();
    expect(screen.getByTestId('button-Plan Trip')).toBeInTheDocument();
    expect(screen.getByTestId('button-View Trips')).toBeInTheDocument();
    expect(screen.getByTestId('button-Mileages')).toBeInTheDocument();
    expect(screen.getByTestId('button-Settings')).toBeInTheDocument();
    expect(screen.getByTestId('button-Disclaimers')).toBeInTheDocument();
    expect(screen.queryByTestId('button-Upgrade')).not.toBeInTheDocument();
    expect(screen.getByTestId('button-Logout')).toBeInTheDocument();
  });

  test('renders welcome and buttons for user role with active trial', () => {
    useCheckAuthStatusQuery.mockReturnValue({
      data: { isAuthenticated: true, name: 'RegularUser', role: 'user', trial_started_at: '2023-01-01' },
      refetch: jest.fn(),
    });
    isTrialActive.mockReturnValue(true);
    renderWithRouter(['/auth'], <Auth />);
    expect(screen.getByText('Welcome, RegularUser!')).toBeInTheDocument();
    expect(screen.getByTestId('button-Plan Trip')).toBeInTheDocument();
    expect(screen.getByTestId('button-View Trips')).toBeInTheDocument();
    expect(screen.getByTestId('button-Mileages')).toBeInTheDocument();
    expect(screen.getByTestId('button-Settings')).toBeInTheDocument();
    expect(screen.getByTestId('button-Disclaimers')).toBeInTheDocument();
    expect(screen.getByTestId('button-Upgrade')).toBeInTheDocument();
    expect(screen.getByTestId('button-Logout')).toBeInTheDocument();
  });

  test('renders welcome and buttons for user role without active trial', () => {
    useCheckAuthStatusQuery.mockReturnValue({
      data: { isAuthenticated: true, name: 'RegularUser', role: 'user', trial_started_at: '2023-01-01' },
      refetch: jest.fn(),
    });
    isTrialActive.mockReturnValue(false);
    renderWithRouter(['/auth'], <Auth />);
    expect(screen.getByText('Welcome, RegularUser!')).toBeInTheDocument();
    expect(screen.queryByTestId('button-Plan Trip')).not.toBeInTheDocument();
    expect(screen.queryByTestId('button-View Trips')).not.toBeInTheDocument();
    expect(screen.getByTestId('button-Mileages')).toBeInTheDocument();
    expect(screen.getByTestId('button-Settings')).toBeInTheDocument();
    expect(screen.getByTestId('button-Disclaimers')).toBeInTheDocument();
    expect(screen.getByTestId('button-Upgrade')).toBeInTheDocument();
    expect(screen.getByTestId('button-Logout')).toBeInTheDocument();
  });

  test('handles logout on click', async () => {
    useCheckAuthStatusQuery.mockReturnValue({
      data: { isAuthenticated: true, name: 'User', role: 'user' },
      refetch: jest.fn(),
    });
    const mockLogout = jest.fn().mockResolvedValue({});
    useLogoutMutation.mockReturnValue([mockLogout, { isLoading: false }]);
    renderWithRouter(['/auth'], <Auth />);
    await userEvent.click(screen.getByTestId('button-Logout'));
    expect(mockLogout).toHaveBeenCalled();
    await waitFor(() => expect(window.location.pathname).toBe('/'));
  });

  test('refetches on auth success param and cleans URL', () => {
    renderWithRouter(['/auth?auth=success'], <Auth />);
    expect(mockRefetch).toHaveBeenCalled();
    expect(window.location.search).toBe('');
  });
});
