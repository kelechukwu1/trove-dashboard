"use client";

import { useState } from "react";
import { usePortfolioData } from "@/hooks/use-portfolio";
import { TransactionsTable } from "@/components/transactions-table";
import { Pagination } from "@/components/ui/pagination";
import { ITEMS_PER_PAGE } from "@/constants";
import { LucideLoader2 } from "lucide-react";


export default function TransactionsPage() {
  const { transactions, isLoading } = usePortfolioData();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentTransactions = transactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-full min-h-[80vh]">
        <LucideLoader2 className="size-8 text-primary animate-spin" />
      </div>
    );
  return (
    <div className="space-y-5 lg:space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">All Transactions</h1>
        <p className="text-sm text-muted-foreground mt-1">A complete history of your account's transactions.</p>
      </div>
      <div className="w-full">
        <div className="flex flex-col gap-4">
          <TransactionsTable transactions={currentTransactions} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
