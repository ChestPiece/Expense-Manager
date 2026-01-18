"use client";

import { cn } from "@/lib/utils";

interface BudgetProgressProps {
  totalSpent: number;
  totalBudget: number;
  currencySymbol: string;
}

export function BudgetProgress({
  totalSpent,
  totalBudget,
  currencySymbol,
}: BudgetProgressProps) {
  const percentage = Math.min(
    100,
    Math.round((totalSpent / (totalBudget || 1)) * 100),
  );

  let statusColor = "bg-primary";
  let statusText = "Safe Zone";
  let textColor = "text-primary";

  if (percentage >= 100) {
    statusColor = "bg-destructive";
    statusText = "Over Budget";
    textColor = "text-destructive";
  } else if (percentage >= 80) {
    statusColor = "bg-yellow-500";
    statusText = "Warning";
    textColor = "text-yellow-500";
  }

  if (totalBudget === 0) return null;

  return (
    <div className="w-full space-y-2 p-4 border-2 border-border bg-card retro-shadow">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs font-mono text-muted-foreground uppercase mb-1">
            Monthly Budget
          </p>
          <p className="text-2xl font-bold font-display">
            {currencySymbol}
            {totalSpent.toFixed(0)}
            <span className="text-muted-foreground text-lg ml-1">
              / {currencySymbol}
              {totalBudget.toFixed(0)}
            </span>
          </p>
        </div>
        <div className="text-right">
          <p className={cn("font-bold text-sm", textColor)}>{statusText}</p>
          <p className="text-xs text-muted-foreground font-mono">
            {percentage}% Used
          </p>
        </div>
      </div>
      <div className="h-4 w-full bg-secondary border-2 border-border overflow-hidden relative">
        <div
          className={cn(
            "h-full transition-all duration-500 ease-out",
            statusColor,
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
