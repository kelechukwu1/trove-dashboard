import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/utils";
import { cn } from "@/lib/utils";
import { TransactionStatus, TransactionType } from "@/enum";
import {
  LuPlus,
  LuMinus,
  LuClock,
  LuCircleX,
} from "react-icons/lu";
import type { Transaction } from "@/types/portfolio.types";

export function TransactionRow({ transaction, isLast }: { transaction: Transaction, isLast: boolean }) {
  const isBuy = transaction.type === TransactionType.BUY;
  const isPending = transaction.status === TransactionStatus.PENDING;
  const isFailed = transaction.status === TransactionStatus.FAILED;

  const statusVariant = isPending
    ? "warning"
    : isFailed
      ? "error"
      : "success";

  const amountPrefix = isBuy ? "-" : "+";
  const amountColor = isFailed
    ? "text-foreground line-through"
    : isPending
      ? "text-muted-foreground"
      : "text-foreground";

  return (
    <div
      className={cn(
        "flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors",
        !isLast && "border-b border-border",
        isFailed && "opacity-75"
      )}
    >
      {/* Type icon */}
      <div
        className={cn(
          "size-8 rounded-full flex items-center justify-center shrink-0",
          isBuy ? "bg-primary-light" : "bg-[#E2E8F0]" // light gray for sell
        )}
      >
        {isBuy ? (
          <LuPlus className="size-3.5 text-primary" />
        ) : (
          <LuMinus className="size-3.5 text-muted-foreground" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <span className="text-[14px] font-semibold text-foreground block truncate">
          {isBuy ? "Buy" : "Sell"} {transaction.name}
        </span>
        <span className="text-[12px] text-muted-foreground flex items-center mt-0.5">
          {formatDate(transaction.date)} • {transaction.shares.toFixed(2)} Shares
        </span>
      </div>

      {/* Amount & Status */}
      <div className="text-right flex flex-col items-end gap-1.5">
        <span className={cn("text-[14px] font-bold", amountColor)}>
          {isPending ? (
            <span className="text-muted-foreground text-[12px] font-medium">Price unavailable</span>
          ) : (
            `${amountPrefix}${formatCurrency(transaction.totalAmount)}`
          )}
        </span>
        <Badge
          variant={statusVariant}
          className={cn(
            "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full",
            isPending && "bg-[#FDE68A] text-[#92400E]", // custom warning colors to match wireframe closely
            isFailed && "bg-[#FECACA] text-[#991B1B]",
            !isPending && !isFailed && "bg-[#A7F3D0] text-[#065F46]" // custom success colors
          )}
        >
          {transaction.status}
        </Badge>
      </div>
    </div>
  );
}
