import { formatCurrency, formatDate } from "@/utils";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/types/portfolio.types";
import { TransactionStatus, TransactionType } from "@/enum";
import { LuPlus, LuMinus } from "react-icons/lu";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TransactionsTableProps {
  transactions: Transaction[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="py-12 text-center border border-border rounded-xl bg-card">
        <p className="text-sm text-muted-foreground">No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="font-semibold text-foreground whitespace-nowrap">Transaction</TableHead>
            <TableHead className="font-semibold text-foreground whitespace-nowrap">Date</TableHead>
            <TableHead className="font-semibold text-foreground text-right whitespace-nowrap">Shares</TableHead>
            <TableHead className="font-semibold text-foreground text-right whitespace-nowrap">Price per Share</TableHead>
            <TableHead className="font-semibold text-foreground text-right whitespace-nowrap">Total Amount</TableHead>
            <TableHead className="font-semibold text-foreground text-center whitespace-nowrap">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => {
            const isBuy = transaction.type === TransactionType.BUY;
            const isPending = transaction.status === TransactionStatus.PENDING;
            const isFailed = transaction.status === TransactionStatus.FAILED;

            const statusVariant = isPending ? "warning" : isFailed ? "error" : "success";
            const amountPrefix = isBuy ? "-" : "+";
            const amountColor = isFailed ? "text-foreground line-through opacity-60" : isPending ? "text-muted-foreground" : "text-foreground";

            return (
              <TableRow
                key={transaction.id}
                className={cn(isFailed && "bg-muted/10 opacity-75 hover:bg-muted/10")}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className={cn("size-8 rounded-full flex items-center justify-center shrink-0", isBuy ? "bg-primary-light" : "bg-[#E2E8F0]")}>
                      {isBuy ? (
                        <LuPlus className="size-3.5 text-primary" />
                      ) : (
                        <LuMinus className="size-3.5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">
                        {isBuy ? "Buy" : "Sell"} {transaction.ticker}
                      </span>
                      <span className="text-xs text-muted-foreground">{transaction.name}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-foreground whitespace-nowrap">
                  {formatDate(transaction.date)}
                </TableCell>
                <TableCell className="text-right font-medium text-muted-foreground">
                  {transaction.shares.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {isPending ? "—" : formatCurrency(transaction.pricePerShare)}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  <span className={amountColor}>
                    {isPending ? "Price unavailable" : `${amountPrefix}${formatCurrency(transaction.totalAmount)}`}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={statusVariant}
                    className={cn(
                      "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full",
                      isPending && "bg-[#FDE68A] text-[#92400E]",
                      isFailed && "bg-[#FECACA] text-[#991B1B]",
                      !isPending && !isFailed && "bg-[#A7F3D0] text-[#065F46]"
                    )}
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
