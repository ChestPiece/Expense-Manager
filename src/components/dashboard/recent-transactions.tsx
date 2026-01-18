"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Trash2, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface RecentTransactionsProps {
  expenses: any[];
  categories: any[];
  currencySymbol: string;
  onDelete: (id: string) => void;
}

export function RecentTransactions({
  expenses,
  categories,
  currencySymbol,
  onDelete,
}: RecentTransactionsProps) {
  const recentExpenses = expenses.slice(0, 5); // Show last 5

  return (
    <Card className="border-2 border-border retro-shadow bg-card h-full">
      <CardHeader className="flex flex-row items-center justify-between border-b-2 border-border pb-3">
        <CardTitle className="font-display text-lg uppercase tracking-wider">
          Recent
        </CardTitle>
        <Button
          variant="link"
          className="text-sm font-mono text-muted-foreground p-0 h-auto"
          asChild
        >
          <Link href="/dashboard/transactions">
            View All <ArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-muted/30 border-b border-border">
              <TableHead className="font-bold text-xs uppercase font-mono text-muted-foreground h-9">
                Title
              </TableHead>
              <TableHead className="font-bold text-xs uppercase font-mono text-muted-foreground h-9">
                Category
              </TableHead>
              <TableHead className="font-bold text-xs uppercase font-mono text-muted-foreground text-right h-9">
                Amount
              </TableHead>
              <TableHead className="w-[40px] h-9"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentExpenses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-muted-foreground font-mono text-sm"
                >
                  No recent transactions.
                </TableCell>
              </TableRow>
            ) : (
              recentExpenses.map((expense) => (
                <TableRow
                  key={expense.id}
                  className="group border-b border-border/50 last:border-0 hover:bg-muted/20"
                >
                  <TableCell className="font-medium text-sm py-3">
                    {expense.title}
                    <div className="text-[10px] text-muted-foreground sm:hidden">
                      {format(new Date(expense.created_at), "MMM d")}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="inline-flex items-center rounded-none border border-border px-1.5 py-0.5 text-[10px] sm:text-xs font-mono bg-background">
                      {categories.find((c: any) => c.id === expense.category_id)
                        ?.name || "Uncategorized"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-sm py-3">
                    {currencySymbol}
                    {expense.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="py-3">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onDelete(expense.id)}
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
