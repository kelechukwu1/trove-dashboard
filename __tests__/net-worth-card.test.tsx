import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { NetWorthCard } from '@/components/net-worth-card';
import { TimePeriod } from '@/enum';

// Mock the Chart component since recharts relies on DOM measurement APIs that JSDOM doesn't support well
jest.mock('../app/components/ui/chart', () => ({
  Chart: () => <div data-testid="mock-chart">Chart</div>
}));

describe('NetWorthCard', () => {
  const mockProps = {
    netWorth: 150000,
    change: { amount: 5000, percentage: 3.45 },
    chartData: [{ date: '2024-01-01', value: 150000 }],
    onPeriodChange: jest.fn(),
  };

  it('renders loading state correctly', () => {
    // We can just check that the total net worth text is NOT there, 
    // or look for some structure indicating loading.
    const { container } = render(<NetWorthCard {...mockProps} isLoading={true} />);
    expect(screen.queryByText('Total Net Worth')).toBeNull();
    // Check if the skeleton is rendered (it renders a generic card wrapper without content text)
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders standard state correctly', () => {
    render(<NetWorthCard {...mockProps} />);
    
    // Check Header
    expect(screen.getByText('Total Net Worth')).toBeDefined();
    
    // Check net worth value is formatted correctly
    expect(screen.getByText('$150,000.00')).toBeDefined();
    
    // Check percentage formatting (isPositive = true)
    // The formatPercentage util might prepend its own +, but let's check for the numbers at least
    expect(screen.getByText(/\+?3\.5\%/i)).toBeDefined();
    
    // Check that the mock chart rendered
    expect(screen.getByTestId('mock-chart')).toBeDefined();
  });

  it('toggles visibility of balance when eye icon is clicked', () => {
    render(<NetWorthCard {...mockProps} />);
    
    // Initially visible
    expect(screen.getByText('$150,000.00')).toBeDefined();
    
    // Find the toggle button
    const toggleButton = screen.getByRole('button', { name: /hide balance/i });
    fireEvent.click(toggleButton);
    
    // Now hidden
    expect(screen.queryByText('$150,000.00')).toBeNull();
    expect(screen.getByText('••••••')).toBeDefined();
    
    // Find the toggle button again to show
    const showButton = screen.getByRole('button', { name: /show balance/i });
    fireEvent.click(showButton);
    
    // Visible again
    expect(screen.getByText('$150,000.00')).toBeDefined();
  });

  it('calls onPeriodChange when tabs are clicked', () => {
    render(<NetWorthCard {...mockProps} />);
    
    const oneWeekTab = screen.getByRole('tab', { name: '1W' });
    fireEvent.click(oneWeekTab);
    
    expect(mockProps.onPeriodChange).toHaveBeenCalledWith(TimePeriod.ONE_WEEK);
  });
});
