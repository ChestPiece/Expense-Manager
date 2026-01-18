"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trash2, Loader2, PlusCircle, History } from "lucide-react";
import { Label } from "@/components/ui/label";

interface Category {
  id: string;
  name: string;
  budget?: number | null;
}

import { TopUpDialog } from "@/components/dashboard/top-up-dialog";
import { BudgetHistoryDialog } from "@/components/dashboard/budget-history-dialog";

interface Expense {
  category_id?: string | null;
  amount: number;
}

interface CategoryBudgetsProps {
  categories: Category[];
  expenses: Expense[];
  currencySymbol: string;
  onAddCategory: (category: { name: string; budget: number }) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  onTopUp: (categoryId: string, amount: number, note: string) => Promise<void>;
}

export function CategoryBudgets({
  categories,
  expenses,
  currencySymbol,
  onAddCategory,
  onDeleteCategory,
  onTopUp,
}: CategoryBudgetsProps) {
  const [newCategory, setNewCategory] = useState("");
  const [newBudget, setNewBudget] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [topUpCategory, setTopUpCategory] = useState<Category | null>(null);
  const [historyCategory, setHistoryCategory] = useState<Category | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory || !newBudget) return;
    const budgetVal = parseFloat(newBudget);
    if (isNaN(budgetVal)) return;

    setIsAdding(true);
    try {
      await onAddCategory({
        name: newCategory,
        budget: budgetVal,
      });
      setNewCategory("");
      setNewBudget("");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card className="border-2 border-border retro-shadow bg-card h-full">
      <CardHeader className="border-b-2 border-border pb-3 flex flex-row items-center justify-between">
        <CardTitle className="font-display text-lg uppercase tracking-wider">
          Budgets
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-6">
        {/* List */}
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {categories.map((cat) => {
            const spent = expenses
              .filter((e) => e.category_id === cat.id)
              .reduce((sum, e) => sum + e.amount, 0);
            const budget = cat.budget ?? 0;
            const progress =
              budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
            const over = budget > 0 && spent > budget;

            return (
              <div key={cat.id} className="space-y-1 group">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-muted-foreground">
                      {currencySymbol}
                      {spent.toFixed(0)} / {currencySymbol}
                      {budget}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                      onClick={() => onDeleteCategory(cat.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-primary"
                      onClick={() => setTopUpCategory(cat)}
                    >
                      <PlusCircle className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground"
                      onClick={() => setHistoryCategory(cat)}
                      title="History"
                    >
                      <History className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Progress
                  value={progress}
                  className={`h-3 border border-border rounded-none ${over ? "bg-destructive/20" : "bg-muted"}`}
                  indicatorClassName={over ? "bg-destructive" : "bg-primary"}
                />
              </div>
            );
          })}
          {categories.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4 font-mono">
              No categories set.
            </p>
          )}
        </div>

        {/* Add Form */}
        <div className="pt-4 border-t border-dashed border-border">
          <form onSubmit={handleAdd} className="space-y-3">
            <Label className="font-mono text-xs font-bold uppercase text-muted-foreground">
              New Category
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="h-8 rounded-none border-border text-sm"
              />
              <Input
                placeholder="Budget"
                type="number"
                min="0"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                className="h-8 rounded-none border-border text-sm font-mono"
              />
            </div>
            <Button
              type="submit"
              size="sm"
              variant="outline"
              className="w-full border-2 border-border hover:bg-accent"
              disabled={isAdding}
            >
              {isAdding ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                "ADD CATEGORY"
              )}
            </Button>
          </form>
        </div>
      </CardContent>

      {topUpCategory && (
        <TopUpDialog
          open={!!topUpCategory}
          onOpenChange={(open) => !open && setTopUpCategory(null)}
          categoryName={topUpCategory.name}
          currencySymbol={currencySymbol}
          onConfirm={async (amount, note) => {
            await onTopUp(topUpCategory.id, amount, note);
          }}
        />
      )}

      {historyCategory && (
        <BudgetHistoryDialog
          open={!!historyCategory}
          onOpenChange={(open) => !open && setHistoryCategory(null)}
          categoryId={historyCategory.id}
          categoryName={historyCategory.name}
          currencySymbol={currencySymbol}
        />
      )}
    </Card>
  );
}
