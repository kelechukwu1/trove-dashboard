import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { HoldingsTable } from '@/components/holdings-table';
import type { HoldingWithCalculations } from '@/types/portfolio.types';

describe('HoldingsTable', () => {
  const mockHoldings: HoldingWithCalculations[] = [
    {
      id: '1',
      ticker: 'AAPL',
      name: 'Apple Inc.',
      shares: 10,
      avgCost: 150,
      currentPrice: 160,
      sector: 'Technology',
      currency: 'USD',
      currentValue: 1600,
      totalCost: 1500,
      gainLoss: 100,
      gainLossPercent: 6.67,
      isPriceUnavailable: false,
      isInactive: false,
    },
    {
      id: '2',
      ticker: 'DIS',
      name: 'Disney',
      shares: 0,
      avgCost: 100,
      currentPrice: 90,
      sector: 'Entertainment',
      currency: 'USD',
      currentValue: 0,
      totalCost: 0,
      gainLoss: 0,
      gainLossPercent: 0,
      isPriceUnavailable: false,
      isInactive: true,
    }
  ];

  it('renders table headers', () => {
    render(<HoldingsTable holdings={mockHoldings} />);
    expect(screen.getByText('Asset')).toBeDefined();
    expect(screen.getByText('Sector')).toBeDefined();
    expect(screen.getByText('Shares')).toBeDefined();
    expect(screen.getByText('Current Price')).toBeDefined();
  });

  it('renders regular and inactive holdings', () => {
    render(<HoldingsTable holdings={mockHoldings} />);
    // Regular holding
    expect(screen.getByText('AAPL')).toBeDefined();
    expect(screen.getByText('+$100.00')).toBeDefined();
    expect(screen.getByText(/6\.7\%/i)).toBeDefined();

    // Inactive holding
    expect(screen.getByText('DIS')).toBeDefined();
    expect(screen.getByText('0.00')).toBeDefined(); // Shares
    expect(screen.getByText('—')).toBeDefined();
  });

  it('handles empty state', () => {
    render(<HoldingsTable holdings={[]} />);
    expect(screen.getByText('No holdings found.')).toBeDefined();
  });
});
