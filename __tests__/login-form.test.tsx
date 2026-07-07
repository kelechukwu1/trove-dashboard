import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '@/components/login-form';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { login } from '@/services/auth.service';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the auth service
jest.mock('../app/services/auth.service', () => ({
  login: jest.fn(),
}));

describe('LoginForm', () => {
  let queryClient: QueryClient;
  const mockPush = jest.fn();
  
  beforeEach(() => {
    queryClient = new QueryClient();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    // Reset Zustand store state if needed, or just let it be since it's an isolated test
    useAuthStore.setState({ isAuthenticated: false, userEmail: null });
    jest.clearAllMocks();
  });

  const renderWithProviders = (component: React.ReactNode) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  it('renders all form fields correctly', () => {
    renderWithProviders(<LoginForm />);
    
    expect(screen.getByText('Welcome back')).toBeDefined();
    expect(screen.getByPlaceholderText('name@example.com')).toBeDefined();
    expect(screen.getByPlaceholderText('Enter your password')).toBeDefined();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDefined();
  });

  it('shows validation errors for empty fields', async () => {
    renderWithProviders(<LoginForm />);
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Email address is required/i)).toBeDefined();
      expect(screen.getByText(/Password is required/i)).toBeDefined();
    });
  });

  it('calls login mutation on valid submission', async () => {
    (login as jest.Mock).mockResolvedValue('test@example.com');
    
    renderWithProviders(<LoginForm />);
    
    const emailInput = screen.getByPlaceholderText('name@example.com');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('test@example.com', expect.anything());
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
      expect(useAuthStore.getState().userEmail).toBe('test@example.com');
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });
  });
});
