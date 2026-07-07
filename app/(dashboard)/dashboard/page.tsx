"use client";

import { usePortfolioData } from "@/hooks/use-portfolio";
import { NetWorthCard } from "@/components/net-worth-card";
import { AllocationCard } from "@/components/allocation-card";
import { AccountList } from "@/components/account-list";
import { HoldingsList } from "@/components/holdings-list";
import { TransactionsList } from "@/components/transactions-list";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function DashboardPage() {
  const {
    allHoldings,
    transactions,
    netWorth,
    portfolioChange,
    allocation,
    accounts,
    chartData,
    isLoading,
    fetchChartData,
  } = usePortfolioData();

  return (
    <div className="space-y-5 lg:space-y-6">
      {/* Net Worth + Allocation Row */}
      <div className="flex flex-col lg:flex-row gap-4">
        <NetWorthCard
          netWorth={netWorth}
          change={portfolioChange}
          chartData={chartData}
          onPeriodChange={fetchChartData}
          isLoading={isLoading}
        />
        <AllocationCard
          allocation={allocation}
          isLoading={isLoading}
        />
      </div>

      {/* Account summary cards */}
      <AccountList accounts={accounts} isLoading={isLoading} />

      {/* Holdings & Transactions — tabbed on mobile, side by side on desktop */}
      <div className="block lg:hidden md:pb-8 xl:pb-0">
        <Tabs defaultValue="stocks">
          <TabsList>
            <TabsTrigger value="stocks">Stocks</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>
          <TabsContent value="stocks">
            <HoldingsList
              holdings={allHoldings}
              isLoading={isLoading}
              limit={7}
            />
          </TabsContent>
          <TabsContent value="orders">
            <TransactionsList
              transactions={transactions}
              isLoading={isLoading}
              limit={7}
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="hidden lg:grid lg:grid-cols-2 gap-6 pb-8">
        <HoldingsList
          holdings={allHoldings}
          isLoading={isLoading}
          limit={7}
        />
        <TransactionsList
          transactions={transactions}
          isLoading={isLoading}
          limit={7}
        />
      </div>
    </div>
  );
}
