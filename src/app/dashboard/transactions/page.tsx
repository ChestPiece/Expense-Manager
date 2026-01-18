"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useExpenses } from "@/hooks/useExpenses";
import { TransactionList } from "@/components/dashboard/transaction-list";
import { ConfirmDialog } from "@/components/confirm-dialog";

interface Currency {
  code: string;
  symbol: string;
  name: string;
}

interface Category {
  id: string;
  user_id: string;
  name: string;
  budget: number;
}

export default function TransactionsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [currency, setCurrency] = useState<string>("PKR");
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const { expenses, loading, fetchExpenses } = useExpenses(userId);

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id || null);
    }
    getUser();
  }, [supabase]);

  useEffect(() => {
    if (!userId) return;
    async function fetchData() {
      // Categories
      const { data: catData } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", userId);
      if (catData) setCategories(catData as Category[]);

      // Currency Pref
      const { data: currenciesData } = await supabase
        .from("currencies")
        .select("*");
      if (currenciesData) setCurrencies(currenciesData as Currency[]);

      const { data: prefData } = await supabase
        .from("user_preferences")
        .select("currency_code")
        .eq("user_id", userId)
        .single();
      if (prefData?.currency_code) setCurrency(prefData.currency_code);
    }
    fetchData();
  }, [userId, supabase]);

  async function handleDelete(id: string) {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (pendingDeleteId) {
      await supabase.from("expenses").delete().eq("id", pendingDeleteId);
      setPendingDeleteId(null);
      setConfirmOpen(false);
      fetchExpenses();
    }
  }

  const currencyObj = currencies.find((c) => c.code === currency) || {
    code: "PKR",
    symbol: "Rs",
    name: "Pakistani Rupee",
  };

  if (!userId || loading) {
    return (
      <div className="p-12 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold uppercase tracking-tight">
          Transactions
        </h1>
        <p className="font-mono text-sm text-muted-foreground">
          History of all your expenses.
        </p>
      </div>

      <TransactionList
        expenses={expenses}
        categories={categories}
        currencySymbol={currencyObj.symbol}
        onDelete={handleDelete}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={confirmDelete}
        title="Delete Transaction?"
        description="This action cannot be undone."
        confirmText="DELETE"
        cancelText="CANCEL"
      />
    </div>
  );
}
