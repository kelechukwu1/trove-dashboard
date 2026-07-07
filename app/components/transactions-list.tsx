"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Transaction } from "@/types/portfolio.types";
import { TransactionRow } from "./transaction-row";

interface TransactionsListProps {
  transactions: Transaction[];
  isLoading?: boolean;
  limit?: number;
}

export function TransactionsList({
  transactions,
  isLoading = false,
  limit,
}: TransactionsListProps) {

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Card className="shadow-sm border-border">
          <CardContent className="p-0">
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayedTransactions = limit ? transactions.slice(0, limit) : transactions;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Header outside the card */}
      <div className="flex items-center justify-between mb-2 lg:mb-4">
        <h2 className="text-base font-bold text-foreground">
          Recent Transactions
        </h2>

        <Link href="/transactions" className="text-xs font-bold text-primary hover:underline hover:text-primary/80 transition-colors">
          View All
        </Link>
      </div>

      {/* Single card containing all rows */}
      <Card className="shadow-sm border-border overflow-hidden">
        <CardContent className="p-0 flex flex-col">
          {displayedTransactions.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No transactions found
              </p>
            </div>
          ) : (
            displayedTransactions.map((transaction, index) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                isLast={index === displayedTransactions.length - 1}
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
