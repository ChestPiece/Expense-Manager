import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

interface StatsCardsProps {
  expenses: any[]; // Using any for brevity, can refine
  categories: any[];
  currencySymbol: string;
  totalBudget?: number; // Optional
}

export function StatsCards({
  expenses,
  categories,
  currencySymbol,
}: StatsCardsProps) {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Calculate top category
  const categoryTotals: Record<string, number> = {};
  expenses.forEach((e) => {
    if (e.category_id) {
      categoryTotals[e.category_id] =
        (categoryTotals[e.category_id] || 0) + e.amount;
    }
  });

  let topCategoryId = null;
  let maxSpent = 0;

  Object.entries(categoryTotals).forEach(([id, amount]) => {
    if (amount > maxSpent) {
      maxSpent = amount;
      topCategoryId = id;
    }
  });

  const topCategoryName = topCategoryId
    ? categories.find((c) => c.id === topCategoryId)?.name
    : "N/A";

  const totalBudget = categories.reduce((sum, c) => sum + c.budget, 0);
  const remainingBudget = totalBudget - totalSpent;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-2 border-border retro-shadow bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-mono font-bold uppercase text-muted-foreground">
            Total Spent
          </CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-display">
            {currencySymbol}
            {totalSpent.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            Lifetime expenses
          </p>
        </CardContent>
      </Card>

      <Card className="border-2 border-border retro-shadow bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-mono font-bold uppercase text-muted-foreground">
            Remaining Budget
          </CardTitle>
          <TrendingDown
            className={`h-4 w-4 ${remainingBudget < 0 ? "text-destructive" : "text-primary"}`}
          />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold font-display ${remainingBudget < 0 ? "text-destructive" : "text-foreground"}`}
          >
            {currencySymbol}
            {remainingBudget.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            of {currencySymbol}
            {totalBudget.toFixed(0)} total budget
          </p>
        </CardContent>
      </Card>

      <Card className="border-2 border-border retro-shadow bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-mono font-bold uppercase text-muted-foreground">
            Top Category
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-display truncate">
            {topCategoryName || "None"}
          </div>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            {currencySymbol}
            {maxSpent.toFixed(2)} spent
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
