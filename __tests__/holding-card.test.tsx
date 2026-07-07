import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { HoldingCard } from '@/components/holding-card';
import type { HoldingWithCalculations } from '@/types/portfolio.types';

describe('HoldingCard', () => {
  const baseHolding: HoldingWithCalculations = {
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
  };

  it('renders a normal holding correctly', () => {
    render(<HoldingCard holding={baseHolding} />);
    expect(screen.getByText('AAPL')).toBeDefined();
    expect(screen.getByText('Apple Inc.')).toBeDefined();
    expect(screen.getByText('$1,600.00')).toBeDefined();
    expect(screen.getByText('+$100.00 (+6.7%)')).toBeDefined();
  });

  it('renders correctly when gain is negative', () => {
    const negativeHolding: HoldingWithCalculations = {
      ...baseHolding,
      currentPrice: 140,
      currentValue: 1400,
      gainLoss: -100,
      gainLossPercent: -6.67,
    };
    render(<HoldingCard holding={negativeHolding} />);
    expect(screen.getByText('-$100.00 (-6.7%)')).toBeDefined();
  });

  it('renders Price unavailable state correctly', () => {
    const unavailableHolding: HoldingWithCalculations = {
      ...baseHolding,
      isPriceUnavailable: true,
      currentPrice: 0,
      currentValue: 0,
      gainLoss: -1500,
      gainLossPercent: -100,
    };
    render(<HoldingCard holding={unavailableHolding} />);
    expect(screen.getByText('Price unavailable')).toBeDefined();
    expect(screen.getByText('—')).toBeDefined();
    expect(screen.getByText('N/A')).toBeDefined();
  });

  it('renders 0 shares inactive state correctly', () => {
    const inactiveHolding: HoldingWithCalculations = {
      ...baseHolding,
      isInactive: true,
      shares: 0,
      currentValue: 0,
      gainLoss: 0,
      gainLossPercent: 0,
    };
    render(<HoldingCard holding={inactiveHolding} />);
    expect(screen.getByText('0 shares')).toBeDefined();
    expect(screen.getByText('$0.00')).toBeDefined();
    // Inactive holds now show N/A for gain/loss
    expect(screen.queryByText('N/A')).toBeDefined();
  });
});
