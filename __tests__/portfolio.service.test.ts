import { portfolioService } from '../app/services/portfolio.service';

// Mock simulateDelay so tests don't take forever
jest.mock('../app/utils/portfolio.helpers', () => {
  const original = jest.requireActual('../app/utils/portfolio.helpers');
  return {
    ...original,
    simulateDelay: jest.fn().mockResolvedValue(undefined),
  };
});

describe('portfolio.service', () => {
  it('getActiveHoldings returns unfiltered holdings mapped', async () => {
    const holdings = await portfolioService.getActiveHoldings();
    expect(holdings).toBeInstanceOf(Array);
    expect(holdings.length).toBeGreaterThan(0);
    // Since the filter h.shares > 0 is back, DIS (shares=0) should NOT be included
    expect(holdings.some(h => h.ticker === 'DIS')).toBe(false);
  });

  it('getNetWorth calculates properly from raw holdings', async () => {
    const netWorth = await portfolioService.getNetWorth();
    expect(typeof netWorth).toBe('number');
    expect(netWorth).toBeGreaterThan(0);
  });

  it('getPortfolioChange calculates amount and percentage', async () => {
    const change = await portfolioService.getPortfolioChange();
    expect(change).toHaveProperty('amount');
    expect(change).toHaveProperty('percentage');
    expect(typeof change.amount).toBe('number');
    expect(typeof change.percentage).toBe('number');
  });

  it('getSectorAllocation returns valid allocations', async () => {
    const allocations = await portfolioService.getSectorAllocation();
    expect(allocations).toBeInstanceOf(Array);
    if (allocations.length > 0) {
      expect(allocations[0]).toHaveProperty('sector');
      expect(allocations[0]).toHaveProperty('value');
      expect(allocations[0]).toHaveProperty('percentage');
    }
  });

  it('getChartData returns valid data for 1M', async () => {
    const chartData = await portfolioService.getChartData('1M');
    expect(chartData).toBeInstanceOf(Array);
    expect(chartData.length).toBe(30);
    expect(chartData[0]).toHaveProperty('date');
    expect(chartData[0]).toHaveProperty('value');
  });
});
