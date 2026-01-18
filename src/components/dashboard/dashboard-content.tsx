"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { CategoryBudgets } from "@/components/dashboard/category-budgets";
import { AddExpenseForm } from "@/components/dashboard/add-expense-form";
import { CurrencySelector } from "@/components/dashboard/currency-selector";
import { BudgetProgress } from "@/components/dashboard/budget-progress";
import { useRouter } from "next/navigation";
import { isSameMonth, parseISO } from "date-fns";

interface Currency {
  code: string;
  symbol: string;
  name: string;
}

interface Category {
  id: string;
  user_id: string;
  name: string;
  budget?: number | null;
}

interface Expense {
  id: string;
  title: string;
  amount: number;
  category_id?: string | null;
  created_at: string;
}

interface DashboardClientProps {
  initialUserId: string;
  initialExpenses: Expense[];
  initialCategories: Category[];
  initialCurrency: string;
  initialCurrencies: Currency[];
}

export function DashboardClient({
  initialUserId,
  initialExpenses,
  initialCategories,
  initialCurrency,
  initialCurrencies,
}: DashboardClientProps) {
  const [userId] = useState<string>(initialUserId);
  const supabase = createClient();
  const router = useRouter();

  // State
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [currency, setCurrency] = useState(initialCurrency);

  // Dialogs
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // Sync latest data occasionally or on actions
  const refreshData = async () => {
    // We can re-fetch just the expenses here for client-side updates without full refresh
    // Or we can rely on router.refresh() to re-run server component fetching
    // For smoother UX on simple adds, let's fetch client-side OR optimistically update.
    // Let's use router.refresh() for simplicity with server components pattern,
    // but maybe manual fetch for speed perception
    const { data } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (data) setExpenses(data);

    // Also re-fetch categories just in case
    const { data: catData } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", userId);
    if (catData) setCategories(catData as Category[]);

    router.refresh();
  };

  // Handlers
  async function handleCurrencyChange(newCurrency: string) {
    setCurrency(newCurrency);
    if (userId) {
      await supabase.from("user_preferences").upsert({
        user_id: userId,
        currency_code: newCurrency,
      });
    }
  }

  async function handleAddExpense(expense: {
    title: string;
    amount: number;
    categoryId: string;
  }) {
    if (!userId) return;
    const { error } = await supabase.from("expenses").insert({
      user_id: userId,
      title: expense.title,
      amount: expense.amount,
      category_id: expense.categoryId,
    });
    if (!error) {
      await refreshData();
    }
  }

  async function handleAddCategory(category: { name: string; budget: number }) {
    if (!userId) return;
    const { data, error } = await supabase
      .from("categories")
      .insert({
        user_id: userId,
        name: category.name,
        budget: category.budget,
      })
      .select();

    if (!error && data) {
      setCategories([...categories, ...data]);
      router.refresh();
    }
  }

  async function handleDeleteCategory(id: string) {
    if (!userId) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (!error) {
      setCategories(categories.filter((c) => c.id !== id));
      router.refresh();
    }
  }

  async function confirmDeleteExpense() {
    if (pendingDeleteId) {
      await supabase.from("expenses").delete().eq("id", pendingDeleteId);
      setPendingDeleteId(null);
      setConfirmOpen(false);
      await refreshData();
    }
  }

  // Derived
  const currencyObj = initialCurrencies.find((c) => c.code === currency) || {
    code: "PKR",
    name: "Pakistani Rupee",
    symbol: "Rs",
  };

  const totalBudget = categories.reduce(
    (sum, cat) => sum + (cat.budget || 0),
    0,
  );
  const now = new Date();
  const totalSpent = expenses
    .filter((e) => isSameMonth(parseISO(e.created_at), now))
    .reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground">
            Overview
          </h1>
          <p className="font-mono text-sm text-muted-foreground">
            Welcome back to your financial command center.
          </p>
        </div>
        <CurrencySelector
          currency={currency}
          currencies={initialCurrencies}
          onCurrencyChange={handleCurrencyChange}
        />
      </div>

      {/* Stats */}
      <StatsCards
        expenses={expenses}
        categories={categories}
        currencySymbol={currencyObj.symbol}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Left Column (Transactions & Add) */}
        <div className="xl:col-span-2 space-y-6">
          {/* Add Expense */}
          <div className="h-auto">
            <AddExpenseForm
              categories={categories}
              currencySymbol={currencyObj.symbol}
              onAddExpense={handleAddExpense}
            />
          </div>

          {/* Transactions */}
          <div className="h-auto">
            <RecentTransactions
              expenses={expenses}
              categories={categories}
              currencySymbol={currencyObj.symbol}
              onDelete={(id) => {
                setPendingDeleteId(id);
                setConfirmOpen(true);
              }}
            />
          </div>
        </div>

        {/* Right Column (Budgets) */}
        <div className="xl:col-span-1 h-full space-y-6">
          <BudgetProgress
            totalSpent={totalSpent}
            totalBudget={totalBudget}
            currencySymbol={currencyObj.symbol}
          />
          <CategoryBudgets
            categories={categories}
            expenses={expenses}
            currencySymbol={currencyObj.symbol}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={confirmDeleteExpense}
        title="Delete Transaction?"
        description="This action cannot be undone."
        confirmText="DELETE"
        cancelText="CANCEL"
      />
    </div>
  );
}
