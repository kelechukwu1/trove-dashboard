"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatPercentage } from "@/utils";
import { cn } from "@/lib/utils";
import {
  LuBuilding,
  LuBuilding2,
  LuFactory,
  LuStore,
  LuLandmark,
  LuWarehouse,
  LuBriefcase
} from "react-icons/lu";
import type { HoldingWithCalculations } from "@/types/portfolio.types";

const ORG_ICONS = [
  LuBuilding,
  LuBuilding2,
  LuFactory,
  LuStore,
  LuLandmark,
  LuWarehouse,
  LuBriefcase
];

interface HoldingCardProps {
  holding: HoldingWithCalculations;
}

export function HoldingCard({ holding }: HoldingCardProps) {
  const isPositive = holding.gainLoss >= 0;

  const iconColor = holding.isInactive
    ? "text-[var(--disabled)]"
    : "text-primary";

  // Pseudo-randomly pick an organization icon based on the first character of the ticker
  const iconIndex = holding.ticker.charCodeAt(0) % ORG_ICONS.length;
  const IconComponent = ORG_ICONS[iconIndex];

  return (
    <Card
      className={cn(
        "hover:shadow-sm transition-all duration-200 cursor-pointer",
        holding.isInactive && "opacity-60"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4 w-full">
          {/* Group 1: Icon + Name & Ticker */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Stock icon */}
            <div
              className={cn(
                "size-8 rounded-md border flex items-center justify-center shrink-0",

              )}
            >
              <IconComponent className={cn("size-3.5", iconColor)} />
            </div>

            {/* Name & ticker */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-foreground whitespace-nowrap">
                  {holding.ticker}
                </span>
                {holding.isPriceUnavailable && (
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#FFF3CD] text-[#856404] font-medium whitespace-nowrap">
                    Price unavailable
                  </span>
                )}
                {holding.isInactive && (
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-muted text-(--disabled) font-medium whitespace-nowrap">
                    0 shares
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground block whitespace-nowrap">
                {holding.name}
              </span>
            </div>
          </div>

          {/* Group 2: Shares */}
          <div className="hidden sm:flex flex-col items-center justify-center text-center shrink-0">
            <span className="text-[11px] text-muted-foreground block whitespace-nowrap">
              Shares
            </span>
            <span className="text-sm font-medium text-foreground whitespace-nowrap">
              {holding.shares.toFixed(2)}
            </span>
          </div>

          {/* Group 3: Value & Gain/Loss */}
          <div className="text-right flex flex-col justify-end shrink-0">
            <span className="text-[14px] font-bold text-foreground block whitespace-nowrap">
              {holding.isPriceUnavailable
                ? "—"
                : formatCurrency(holding.currentValue)}
            </span>
            {!holding.isInactive && (
              <span
                className={cn(
                  "text-xs font-medium whitespace-nowrap",
                  holding.isPriceUnavailable
                    ? "text-[#856404]"
                    : isPositive
                      ? "text-success"
                      : "text-destructive"
                )}
              >
                {holding.isPriceUnavailable
                  ? "N/A"
                  : `${isPositive ? "+" : ""}${formatCurrency(holding.gainLoss)} (${formatPercentage(holding.gainLossPercent)})`}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
