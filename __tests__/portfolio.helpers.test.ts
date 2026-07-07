import { enrichHolding, castTransactions, simulateDelay } from '@/utils/portfolio.helpers';
import type { Holding, Transaction } from '@/types/portfolio.types';

describe('portfolio.helpers', () => {
  describe('enrichHolding', () => {
    it('correctly enriches a normal holding', () => {
      const holding: Holding = {
        id: '1',
        ticker: 'AAPL',
        name: 'Apple Inc.',
        shares: 10,
        avgCost: 150,
        currentPrice: 160,
        sector: 'Technology',
        currency: 'USD'
      };

      const enriched = enrichHolding(holding);
      expect(enriched.currentValue).toBe(1600);
      expect(enriched.totalCost).toBe(1500);
      expect(enriched.gainLoss).toBe(100);
      expect(enriched.gainLossPercent).toBe((100 / 1500) * 100);
      expect(enriched.isPriceUnavailable).toBe(false);
      expect(enriched.isInactive).toBe(false);
    });

    it('handles shares === 0 correctly (inactive holding)', () => {
      const holding: Holding = {
        id: '2',
        ticker: 'DIS',
        name: 'Disney',
        shares: 0,
        avgCost: 100,
        currentPrice: 90,
        sector: 'Entertainment',
        currency: 'USD'
      };

      const enriched = enrichHolding(holding);
      expect(enriched.isInactive).toBe(true);
      expect(enriched.isPriceUnavailable).toBe(false);
      expect(enriched.currentValue).toBe(0);
      expect(enriched.totalCost).toBe(0);
      expect(enriched.gainLoss).toBe(0);
      expect(enriched.gainLossPercent).toBe(0);
    });

    it('handles currentPrice === 0 correctly (price unavailable / total loss)', () => {
      const holding: Holding = {
        id: '3',
        ticker: 'NVDA',
        name: 'NVIDIA',
        shares: 5,
        avgCost: 100,
        currentPrice: 0,
        sector: 'Technology',
        currency: 'USD'
      };

      const enriched = enrichHolding(holding);
      expect(enriched.isPriceUnavailable).toBe(true);
      expect(enriched.isInactive).toBe(false);
      expect(enriched.currentValue).toBe(0);
      expect(enriched.totalCost).toBe(500);
      expect(enriched.gainLoss).toBe(-500);
      expect(enriched.gainLossPercent).toBe(-100);
    });
  });

  describe('castTransactions', () => {
    it('correctly maps raw transactions to Transaction interface', () => {
      const rawTransactions = [
        {
          id: "t1",
          type: "BUY",
          ticker: "AAPL",
          name: "Apple Inc.",
          shares: 5,
          price: 150.25,
          date: "2023-10-15T10:30:00Z",
          status: "COMPLETED"
        }
      ];

      const casted = castTransactions(rawTransactions as any);
      expect(casted[0].type).toBe("BUY");
      expect(casted[0].status).toBe("COMPLETED");
      expect(casted[0].date).toBe("2023-10-15T10:30:00Z");
    });
  });

});
