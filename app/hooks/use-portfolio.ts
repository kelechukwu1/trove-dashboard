"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { portfolioService } from "@/services/portfolio.service";

export function usePortfolioData() {
  const [period, setPeriod] = useState("1D");

  // Base portfolio data query
  const {
    data: baseData,
    isLoading: isBaseLoading,
    error: baseError,
    refetch: refetchBase,
  } = useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => {
      const [user, holdings, allHoldings, transactions, allocation, accounts] =
        await Promise.all([
          portfolioService.getUser(),
          portfolioService.getActiveHoldings(),
          portfolioService.getHoldings(),
          portfolioService.getTransactions(),
          portfolioService.getSectorAllocation(),
          portfolioService.getAccounts(),
        ]);

      return {
        user,
        holdings,
        allHoldings,
        transactions,
        allocation,
        accounts,
      };
    },
  });

  // Chart data query (depends on period)
  const {
    data: chartResult,
    isLoading: isChartLoading,
    error: chartError,
  } = useQuery({
    queryKey: ["chart", period],
    queryFn: async () => {
      const data = await portfolioService.getChartData(period);

      let netWorth = 0;
      let portfolioChange = { amount: 0, percentage: 0 };

      if (data.length > 0) {
        const startValue = data[0].value;
        const endValue = data[data.length - 1].value;
        const amount = endValue - startValue;
        const percentage = startValue > 0 ? (amount / startValue) * 100 : 0;

        netWorth = endValue;
        portfolioChange = { amount, percentage };
      }

      return { data, netWorth, portfolioChange };
    },
  });

  const isLoading = isBaseLoading || isChartLoading;
  const error =
    baseError || chartError
      ? "Failed to load portfolio data. Please try again."
      : null;

  return {
    user: baseData?.user ?? null,
    holdings: baseData?.holdings ?? [],
    allHoldings: baseData?.allHoldings ?? [],
    transactions: baseData?.transactions ?? [],
    allocation: baseData?.allocation ?? [],
    accounts: baseData?.accounts ?? [],
    chartData: chartResult?.data ?? [],
    netWorth: chartResult?.netWorth ?? 0,
    portfolioChange: chartResult?.portfolioChange ?? {
      amount: 0,
      percentage: 0,
    },
    isLoading,
    error,
    period,
    fetchChartData: setPeriod,
    refetch: refetchBase,
  };
}
