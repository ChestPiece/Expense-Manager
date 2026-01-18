"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Trash2, Search, ArrowUpDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TransactionListProps {
  expenses: any[];
  categories: any[];
  currencySymbol: string;
  onDelete: (id: string) => void;
}

export function TransactionList({
  expenses,
  categories,
  currencySymbol,
  onDelete,
}: TransactionListProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "category">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filteredExpenses = expenses
    .filter((e) => {
      const cat = categories.find((c) => c.id === e.category_id)?.name || "";
      return (
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        cat.toLowerCase().includes(search.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortDir === "asc"
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === "amount") {
        return sortDir === "asc" ? a.amount - b.amount : b.amount - a.amount;
      } else {
        const catA = categories.find((c) => c.id === a.category_id)?.name || "";
        const catB = categories.find((c) => c.id === b.category_id)?.name || "";
        return sortDir === "asc"
          ? catA.localeCompare(catB)
          : catB.localeCompare(catA);
      }
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-end sm:items-center">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-none border-2 border-border focus-visible:ring-0 focus-visible:border-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "date" | "amount" | "category")
            }
            className="flex h-10 w-[130px] rounded-none border-2 border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono font-bold"
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="category">Category</option>
          </select>
          <Button
            variant="outline"
            size="icon"
            className="border-2 border-border rounded-none w-10 h-10"
            onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="border-2 border-border retro-shadow bg-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-b-2 border-border hover:bg-muted/30">
                <TableHead className="font-bold text-xs uppercase font-mono text-muted-foreground">
                  Title
                </TableHead>
                <TableHead className="font-bold text-xs uppercase font-mono text-muted-foreground">
                  Category
                </TableHead>
                <TableHead className="font-bold text-xs uppercase font-mono text-muted-foreground text-right">
                  Amount
                </TableHead>
                <TableHead className="font-bold text-xs uppercase font-mono text-muted-foreground text-center">
                  Date
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center font-mono text-muted-foreground"
                  >
                    No transactions found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredExpenses.map((expense) => (
                  <TableRow
                    key={expense.id}
                    className="group border-b border-border/50 last:border-0 hover:bg-muted/20"
                  >
                    <TableCell className="font-medium">
                      {expense.title}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-none border border-border px-2 py-0.5 text-xs font-mono bg-background">
                        {categories.find((c) => c.id === expense.category_id)
                          ?.name || "Uncategorized"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold">
                      {currencySymbol}
                      {expense.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground text-xs font-mono">
                      {format(new Date(expense.created_at), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onDelete(expense.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
