"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Chart } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatPercentage } from "@/utils";
import { TimePeriod } from "@/enum";
import { LuEye, LuEyeOff, LuTrendingUp, LuTrendingDown } from "react-icons/lu";
import type { ChartDataPoint } from "@/types/portfolio.types";

interface NetWorthCardProps {
  netWorth: number;
  change: { amount: number; percentage: number };
  chartData: ChartDataPoint[];
  period: string;
  onPeriodChange: (period: string) => void;
  isLoading?: boolean;
  isChartLoading?: boolean;
}

export function NetWorthCard({
  netWorth,
  change,
  chartData,
  period,
  onPeriodChange,
  isLoading = false,
  isChartLoading = false,
}: NetWorthCardProps) {
  const [isHidden, setIsHidden] = useState(false);
  const isPositive = change.percentage >= 0;

  if (isLoading) {
    return (
      <Card className="flex-1">
        <CardContent className="p-5 space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-[180px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex-1 min-w-0">
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Total Net Worth
            </span>
            <button
              onClick={() => setIsHidden(!isHidden)}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label={isHidden ? "Show balance" : "Hide balance"}
            >
              {isHidden ? (
                <LuEyeOff className="h-4 w-4" />
              ) : (
                <LuEye className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Period tabs */}
          <Tabs defaultValue={TimePeriod.ONE_DAY} value={period} onValueChange={onPeriodChange}>
            <TabsList>
              <TabsTrigger value={TimePeriod.ONE_DAY}>1D</TabsTrigger>
              <TabsTrigger value={TimePeriod.ONE_WEEK}>1W</TabsTrigger>
              <TabsTrigger value={TimePeriod.ONE_MONTH}>1M</TabsTrigger>
              <TabsTrigger value={TimePeriod.ALL}>ALL</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Value */}
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-[28px] font-semibold text-foreground leading-tight">
            {isHidden ? "••••••" : formatCurrency(netWorth)}
          </span>
          {!isHidden && (
            <span
              className={`flex items-center gap-1 text-sm font-medium ${
                isPositive ? "text-success" : "text-destructive"
              }`}
            >
              {isPositive ? (
                <LuTrendingUp className="h-4 w-4" />
              ) : (
                <LuTrendingDown className="h-4 w-4" />
              )}
              {formatPercentage(change.percentage)}
            </span>
          )}
        </div>

        {/* Chart */}
        <div className="animate-fade-in mt-4 h-[180px]">
          {isChartLoading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <Chart
              data={chartData}
              color={isPositive ? "#059A83" : "#BF221C"}
              height={180}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
