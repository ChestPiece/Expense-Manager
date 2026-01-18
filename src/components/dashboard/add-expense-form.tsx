"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";

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
    if (!title || !amount || !categoryId) return;

    setIsSubmitting(true);
    try {
      await onAddExpense({
        title,
        amount: parseFloat(amount),
        categoryId,
      });
      setTitle("");
      setAmount("");
      // Keep category selected for quicker entry
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-2 border-border retro-shadow bg-card h-full">
      <CardHeader className="border-b-2 border-border pb-3">
        <CardTitle className="font-display text-lg uppercase tracking-wider">
          New Transaction
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="font-mono text-xs font-bold uppercase"
            >
              Title
            </Label>
            <Input
              id="title"
              placeholder="e.g. Lunch, Taxi"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-none border-2 border-border focus-visible:ring-0 focus-visible:border-primary font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="amount"
                className="font-mono text-xs font-bold uppercase"
              >
                Amount
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-bold text-muted-foreground">
                  {currencySymbol}
                </span>
                <Input
                  id="amount"
                  placeholder="0.00"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 rounded-none border-2 border-border focus-visible:ring-0 focus-visible:border-primary font-mono font-bold"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="category"
                className="font-mono text-xs font-bold uppercase"
              >
                Category
              </Label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="flex h-10 w-full rounded-none border-2 border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="" disabled>
                  Select...
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full font-bold border-2 border-border retro-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            disabled={isSubmitting || loading}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            ADD TRANSACTION
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
