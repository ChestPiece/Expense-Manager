"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Loader2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

interface AddExpenseFormProps {
  categories: Category[];
  currencySymbol: string;
  onAddExpense: (expense: {
    title: string;
    amount: number;
    categoryId: string;
  }) => Promise<void>;
  loading?: boolean;
}

export function AddExpenseForm({
  categories,
  currencySymbol,
  onAddExpense,
  loading,
}: AddExpenseFormProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !categoryId) return; // Title is optional now

    setIsSubmitting(true);
    try {
      await onAddExpense({
        title:
          title ||
          categories.find((c) => c.id === categoryId)?.name ||
          "Expense",
        amount: parseFloat(amount),
        categoryId,
      });
      setTitle("");
      setAmount("");
      // Keep category selected
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-2 border-border retro-shadow bg-card overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3 text-muted-foreground">
          <Zap className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <span className="font-mono text-xs font-bold uppercase tracking-widest">
            Quick Add
          </span>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1 min-w-[120px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground text-lg">
              {currencySymbol}
            </span>
            <Input
              placeholder="0"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-8 h-12 text-lg font-bold border-2 border-border focus-visible:ring-0 focus-visible:border-primary font-mono bg-background"
              required
            />
          </div>

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={cn(
              "flex h-12 flex-1 items-center justify-between border-2 border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 min-w-[140px]",
              categoryId
                ? "font-bold text-foreground"
                : "text-muted-foreground",
            )}
            required
          >
            <option value="" disabled>
              Category
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <Input
            placeholder="What was it? (Opt)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 h-12 border-2 border-border focus-visible:ring-0 focus-visible:border-primary bg-background min-w-[150px]"
          />

          <Button
            type="submit"
            className="h-12 w-full sm:w-auto px-6 font-bold border-2 border-border retro-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none bg-primary text-primary-foreground"
            disabled={isSubmitting || loading}
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Plus className="h-5 w-5" />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
