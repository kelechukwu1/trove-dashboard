import portfolioData from "@/data/portfolio_data.json";
import { SECTOR_COLORS } from "@/constants";
import type {
  PortfolioData,
  User,
  Transaction,
  HoldingWithCalculations,
  SectorAllocation,
  ChartDataPoint,
  Account,
} from "@/types/portfolio.types";

import {
  simulateDelay,
  castTransactions,
  enrichHolding,
} from "@/utils/portfolio.helpers";

class PortfolioService {
  private data: PortfolioData;

  constructor() {
    this.data = portfolioData as unknown as PortfolioData;
  }

  async getUser(): Promise<User> {
    await simulateDelay();
    return this.data.user;
  }

  async getHoldings(): Promise<HoldingWithCalculations[]> {
    await simulateDelay();
    return this.data.holdings.map(enrichHolding);
  }

  async getActiveHoldings(): Promise<HoldingWithCalculations[]> {
    await simulateDelay();
    return this.data.holdings.filter((h) => h.shares > 0).map(enrichHolding);
  }

  async getTransactions(): Promise<Transaction[]> {
    await simulateDelay();
    return castTransactions(this.data.transactions);
  }

  async getNetWorth(): Promise<number> {
    await simulateDelay();
    const activeHoldings = this.data.holdings
      .filter((h) => h.shares > 0 && h.currentPrice > 0)
      .map(enrichHolding);

    return activeHoldings.reduce((sum, h) => sum + h.currentValue, 0);
  }

  async getTotalInvested(): Promise<number> {
    await simulateDelay();
    return this.data.summary.totalInvested;
  }

  async getPortfolioChange(): Promise<{
    amount: number;
    percentage: number;
  }> {
    await simulateDelay();
    const activeHoldings = this.data.holdings
      .filter((h) => h.shares > 0 && h.currentPrice > 0)
      .map(enrichHolding);

    const currentValue = activeHoldings.reduce(
      (sum, h) => sum + h.currentValue,
      0,
    );
    const totalCost = activeHoldings.reduce((sum, h) => sum + h.totalCost, 0);
    const change = currentValue - totalCost;
    const percentage = totalCost > 0 ? (change / totalCost) * 100 : 0;

    return { amount: change, percentage };
  }

  async getSectorAllocation(): Promise<SectorAllocation[]> {
    await simulateDelay(300);

    // Only include active holdings with valid prices
    const activeHoldings = this.data.holdings
      .filter((h) => h.shares > 0 && h.currentPrice > 0)
      .map(enrichHolding);

    const totalValue = activeHoldings.reduce(
      (sum, h) => sum + h.currentValue,
      0,
    );

    const sectorMap = new Map<string, { value: number; positions: number }>();

    activeHoldings.forEach((h) => {
      const existing = sectorMap.get(h.sector) || {
        value: 0,
        positions: 0,
      };
      existing.value += h.currentValue;
      existing.positions += 1;
      sectorMap.set(h.sector, existing);
    });

    const allocations: SectorAllocation[] = [];
    sectorMap.forEach((data, sector) => {
      allocations.push({
        sector,
        value: data.value,
        percentage: totalValue > 0 ? (data.value / totalValue) * 100 : 0,
        color: SECTOR_COLORS[sector] || "#92A29F",
        positions: data.positions,
      });
    });

    // Sort by value descending
    return allocations.sort((a, b) => b.value - a.value);
  }

  async getChartData(period: string): Promise<ChartDataPoint[]> {
    await simulateDelay();

    // Generate synthetic chart data based on period
    const netWorth = this.data.holdings
      .filter((h) => h.shares > 0 && h.currentPrice > 0)
      .reduce((sum, h) => sum + h.shares * h.currentPrice, 0);

    const now = new Date();
    let points: number;
    let dayStep: number;

    switch (period) {
      case "1D":
        points = 24;
        dayStep = 1 / 24;
        break;
      case "1W":
        points = 7;
        dayStep = 1;
        break;
      case "1M":
        points = 30;
        dayStep = 1;
        break;
      case "ALL":
        points = 12;
        dayStep = 30;
        break;
      default:
        points = 24;
        dayStep = 1 / 24;
    }

    const data: ChartDataPoint[] = [];
    let baseValue: number;
    if (period === "1W") {
      baseValue = netWorth * 1.05; // start 5% higher, meaning a loss
    } else if (period === "1D") {
      baseValue = netWorth * 0.98; // 2% gain
    } else if (period === "1M") {
      baseValue = netWorth * 0.9; // 10% gain
    } else {
      baseValue = netWorth * 0.5; // 50% gain for ALL
    }
    const growth = netWorth - baseValue;

    for (let i = 0; i < points; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - (points - i - 1) * dayStep);

      const progress = i / (points - 1);
      // Create big sweeping hills and valleys (slopy curve)
      // The (1 - progress) ensures the wave smoothly returns to 0 at the final point so we hit the exact net worth
      const wave =
        Math.sin(progress * Math.PI * 3.5) * 0.4 * netWorth * (1 - progress);

      // Combine linear growth with the sweeping wave
      const value = baseValue + growth * progress + wave;

      data.push({
        date:
          period === "1D"
            ? date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
        value: Math.round(value * 100) / 100,
      });
    }

    return data;
  }

  async getPortfolioData(): Promise<PortfolioData> {
    await simulateDelay();
    return {
      ...this.data,
      transactions: castTransactions(this.data.transactions),
    };
  }

  async getAccounts(): Promise<Account[]> {
    await simulateDelay();
    return [
      {
        name: "US Portfolio",
        value: 32140.0,
        currencySymbol: "$",
        changePercent: 2.4,
      },
      {
        name: "NG Portfolio",
        value: 4250000,
        currencySymbol: "₦",
        changePercent: -1.2,
      },
      {
        name: "Fixed Income",
        value: 8500.0,
        currencySymbol: "$",
        changePercent: 0.5,
      },
      { name: "GEMS", value: 3360.75, currencySymbol: "$", changePercent: 5.8 },
    ];
  }
}

// Singleton export
export const portfolioService = new PortfolioService();
