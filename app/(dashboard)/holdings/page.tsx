"use client";

import { useState } from "react";
import { usePortfolioData } from "@/hooks/use-portfolio";
import { HoldingsTable } from "@/components/holdings-table";
import { Pagination } from "@/components/ui/pagination";
import { ITEMS_PER_PAGE } from "@/constants";
import { LucideLoader2 } from "lucide-react";

export default function HoldingsPage() {
  const { holdings, isLoading } = usePortfolioData();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(holdings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentHoldings = holdings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[80vh]">
        <LucideLoader2 className="size-8 text-primary animate-spin" />
      </div>
    );
  }
  return (
    <div className="space-y-5 lg:space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">All Holdings</h1>
        <p className="text-sm text-muted-foreground mt-1">View and manage all your portfolio assets.</p>
      </div>
      <div className="w-full">
        <div className="flex flex-col gap-4">
          <HoldingsTable holdings={currentHoldings} />
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
