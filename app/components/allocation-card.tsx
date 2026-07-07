"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Skeleton } from "@/components/ui/skeleton";
import type { SectorAllocation } from "@/types/portfolio.types";

interface AllocationCardProps {
  allocation: SectorAllocation[];
  isLoading?: boolean;
}

export function AllocationCard({
  allocation,
  isLoading = false,
}: AllocationCardProps) {
  if (isLoading) {
    return (
      <Card className="w-full lg:w-[280px]">
        <CardContent className="p-5 space-y-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-full rounded-full" />
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const segments = allocation.map((item) => ({
    value: item.percentage,
    color: item.color,
    label: item.sector,
  }));

  return (
    <Card className="w-full lg:w-[280px]">
      <CardContent className="p-5">
        <h3 className="text-sm font-medium text-foreground mb-4">
          Asset Allocation
        </h3>

        {/* Stacked horizontal bar */}
        <ProgressBar segments={segments} height={14} />

        {/* Legend */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mt-5">
          {allocation.map((item) => (
            <div key={item.sector} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex flex-col">
                <span className="text-[11px] text-muted-foreground leading-tight">
                  {item.sector}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {item.percentage.toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
