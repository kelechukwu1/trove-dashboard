"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Account } from "@/types/portfolio.types";

interface AccountListProps {
  accounts: Account[];
  isLoading?: boolean;
}

export function AccountList({ accounts, isLoading = false }: AccountListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="shadow-sm border-border">
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-3 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {accounts.map((account) => {
        const isPositive = account.changePercent >= 0;

        return (
          <Card
            key={account.name}
            className="hover:shadow-sm transition-shadow duration-200 cursor-pointer shadow-sm border-border rounded-xl"
          >
            <CardContent className="p-4 flex flex-col justify-between">
              <span className="text-[11px] text-muted-foreground font-medium mb-1">
                {account.name}
              </span>
              <p className="text-[16px] font-bold text-foreground mb-1">
                {account.currencySymbol}
                {account.value.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <div className="flex items-center gap-1">
                <span
                  className={`text-[10px] font-bold tracking-wide flex items-center gap-1 ${isPositive ? "text-[#059A83]" : "text-destructive"
                    }`}
                >
                  <span className="text-[8px] leading-none">
                    {isPositive ? "▲" : "▼"}
                  </span>
                  {account.changePercent.toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
