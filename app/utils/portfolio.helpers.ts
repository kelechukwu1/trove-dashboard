import { TransactionStatus, TransactionType } from "@/enum";
import type {
  PortfolioData,
  Transaction,
  Holding,
  HoldingWithCalculations,
} from "@/types/portfolio.types";

const SIMULATED_DELAY_MIN = 400;
const SIMULATED_DELAY_MAX = 800;

export function simulateDelay(): Promise<void> {
  const delay =
    Math.random() * (SIMULATED_DELAY_MAX - SIMULATED_DELAY_MIN) +
    SIMULATED_DELAY_MIN;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export function castTransactions(
  raw: PortfolioData["transactions"],
): Transaction[] {
  return raw.map((t) => ({
    ...t,
    type: t.type as TransactionType,
    status: t.status as TransactionStatus,
  }));
}

export function enrichHolding(holding: Holding): HoldingWithCalculations {
  const isPriceUnavailable = holding.currentPrice === 0;
  const isInactive = holding.shares === 0;

  const currentValue = isInactive
    ? 0
    : isPriceUnavailable
      ? 0
      : holding.shares * holding.currentPrice;

  const totalCost = holding.shares * holding.avgCost;

  const gainLoss = isPriceUnavailable ? -totalCost : currentValue - totalCost;

  const gainLossPercent = totalCost === 0 ? 0 : (gainLoss / totalCost) * 100;

  return {
    ...holding,
    currentValue,
    totalCost,
    gainLoss,
    gainLossPercent,
    isPriceUnavailable,
    isInactive,
  };
}
