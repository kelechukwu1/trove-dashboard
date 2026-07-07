import { formatCurrency, formatPercentage } from "@/utils";
import { cn } from "@/lib/utils";
import type { HoldingWithCalculations } from "@/types/portfolio.types";
import {
  LuTriangleAlert,
  LuBuilding,
  LuBuilding2,
  LuFactory,
  LuStore,
  LuLandmark,
  LuWarehouse,
  LuBriefcase
} from "react-icons/lu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ORG_ICONS = [
  LuBuilding,
  LuBuilding2,
  LuFactory,
  LuStore,
  LuLandmark,
  LuWarehouse,
  LuBriefcase
];

interface HoldingsTableProps {
  holdings: HoldingWithCalculations[];
}

export function HoldingsTable({ holdings }: HoldingsTableProps) {
  if (holdings.length === 0) {
    return (
      <div className="py-12 text-center border border-border rounded-xl bg-card">
        <p className="text-sm text-muted-foreground">No holdings found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <Table className="p-5">
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="font-semibold text-foreground whitespace-nowrap">Asset</TableHead>
            <TableHead className="font-semibold text-foreground whitespace-nowrap">Sector</TableHead>
            <TableHead className="font-semibold text-foreground text-right whitespace-nowrap">Shares</TableHead>
            <TableHead className="font-semibold text-foreground text-right whitespace-nowrap">Avg Cost</TableHead>
            <TableHead className="font-semibold text-foreground text-right whitespace-nowrap">Current Price</TableHead>
            <TableHead className="font-semibold text-foreground text-right whitespace-nowrap">Current Value</TableHead>
            <TableHead className="font-semibold text-foreground text-right whitespace-nowrap">Gain / Loss</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {holdings.map((holding) => {
            const isPositive = holding.gainLoss >= 0;
            const iconColor = holding.isInactive ? "text-[var(--disabled)]" : "text-primary";

            const iconIndex = holding.ticker.charCodeAt(0) % ORG_ICONS.length;
            const IconComponent = ORG_ICONS[iconIndex];

            return (
              <TableRow
                key={holding.id}
                className={cn(holding.isInactive && "opacity-60")}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className={cn("size-8 rounded-md border flex items-center justify-center shrink-0")}>
                      <IconComponent className={cn("size-3.5", iconColor)} />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{holding.ticker}</span>
                        {holding.isPriceUnavailable && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FFF3CD] text-[#856404] font-medium">Price unavailable</span>
                        )}
                        {holding.isInactive && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-(--disabled) font-medium">0 shares</span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{holding.name}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {holding.sector}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {holding.shares.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(holding.avgCost)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {holding.isPriceUnavailable ? "—" : formatCurrency(holding.currentPrice)}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {holding.isPriceUnavailable ? "—" : formatCurrency(holding.currentValue)}
                </TableCell>
                <TableCell className="text-right">
                  {holding.isInactive ? (
                    <span className="text-muted-foreground">—</span>
                  ) : holding.isPriceUnavailable ? (
                    <span className="text-[#856404] font-medium">N/A</span>
                  ) : (
                    <div className={cn("flex flex-col", isPositive ? "text-success" : "text-destructive")}>
                      <span className="font-semibold">
                        {isPositive ? "+" : ""}{formatCurrency(holding.gainLoss)}
                      </span>
                      <span className="text-xs font-medium">
                        {isPositive ? "+" : ""}{formatPercentage(holding.gainLossPercent)}
                      </span>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
