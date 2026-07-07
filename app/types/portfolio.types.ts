import { TransactionStatus, TransactionType } from "@/enum";

export interface User {
  name: string;
  accountId: string;
  lastUpdated: string;
}

export interface Summary {
  totalPortfolioValue: number;
  totalInvested: number;
  currency: string;
}

export interface Holding {
  id: string;
  ticker: string;
  name: string;
  sector: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  currency: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  ticker: string;
  name: string;
  shares: number;
  pricePerShare: number;
  totalAmount: number;
  date: string;
  status: TransactionStatus;
}

export interface PortfolioData {
  user: User;
  summary: Summary;
  holdings: Holding[];
  transactions: Transaction[];
}

export interface HoldingWithCalculations extends Holding {
  currentValue: number;
  totalCost: number;
  gainLoss: number;
  gainLossPercent: number;
  isPriceUnavailable: boolean;
  isInactive: boolean;
}

export interface SectorAllocation {
  sector: string;
  value: number;
  percentage: number;
  color: string;
  positions: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface Account {
  name: string;
  value: number;
  currencySymbol: string;
  changePercent: number;
}
