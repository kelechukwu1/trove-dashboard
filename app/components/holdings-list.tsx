"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { HoldingCard } from "@/components/holding-card";
import type { HoldingWithCalculations } from "@/types/portfolio.types";

interface HoldingsListProps {
  holdings: HoldingWithCalculations[];
  isLoading?: boolean;
  limit?: number;
}

export function HoldingsList({
  holdings,
  isLoading = false,
  limit,
}: HoldingsListProps) {

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[72px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const displayedHoldings = limit ? holdings.slice(0, limit) : holdings;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 lg:mb-4">
        <h2 className="text-base font-semibold text-foreground">Holdings</h2>
        <Link href="/holdings" className="text-xs font-medium text-primary hover:underline hover:text-primary/80 transition-colors">
          View All
        </Link>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        {displayedHoldings.length === 0 ? (
          <Card className="shadow-sm border-border">
            <CardContent className="p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No holdings found
              </p>
            </CardContent>
          </Card>
        ) : (
          displayedHoldings.map((holding) => (
            <HoldingCard key={holding.id} holding={holding} />
          ))
        )}
      </div>
    </div>
  );
}