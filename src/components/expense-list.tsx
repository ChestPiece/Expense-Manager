"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Trash2, Pencil, Plus, TrendingUp, AlertTriangle } from "lucide-react";
import { useExpenses } from "@/hooks/useExpenses";
import { toast } from "sonner";

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

export function ExpenseList({ userId }: { userId: string }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<string>("USD");
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [currencyLoading, setCurrencyLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [newCategory, setNewCategory] = useState("");
  const [newBudget, setNewBudget] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryBudget, setEditCategoryBudget] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "category">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [confirmDeleteAllOpen, setConfirmDeleteAllOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const { expenses, loading, error, fetchExpenses } = useExpenses(userId); // eslint-disable-line @typescript-eslint/no-unused-vars

  useEffect(() => {
    fetchExpenses();
    // eslint-disable-next-line
  }, [userId, supabase]);

  useEffect(() => {
    async function fetchCurrenciesAndPreference() {
      setCurrencyLoading(true);
      const { data: currenciesData, error: currenciesError } = await supabase
        .from("currencies")
        .select("code, symbol, name");
      if (!currenciesError && currenciesData)
        setCurrencies(currenciesData as Currency[]);
      // Fetch user preference
      const { data: prefData } = await supabase
        .from("user_preferences")
        .select("currency_code")
        .eq("user_id", userId)
        .single();
      if (prefData && prefData.currency_code)
        setCurrency(prefData.currency_code);
      setCurrencyLoading(false);
    }
    fetchCurrenciesAndPreference();
  }, [userId, supabase]);

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("id, user_id, name, budget")
        .eq("user_id", userId);
      if (!error && data) setCategories(data as Category[]);
    }
    fetchCategories();
  }, [userId, supabase]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !amount || !categoryId) return;
    const { error } = await supabase.from("expenses").insert({
      user_id: userId,
      title,
      amount: parseFloat(amount),
      category_id: categoryId,
    });
    if (!error) {
      setTitle("");
      setAmount("");
      setCategoryId("");
      fetchExpenses();
      toast.success("Expense added successfully!");
    } else {
      toast.error("Failed to add expense.");
    }
  }

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
      toast.success("Expense deleted.");
    }
  }

  async function handleDeleteAllCategories() {
    setConfirmDeleteAllOpen(true);
  }

  async function confirmDeleteAllCategories() {
    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("user_id", userId);

      if (error) throw error;
      setCategories([]);
      toast.success("All categories deleted.");
    } catch (error) {
      console.error("Error deleting all categories:", error);
      toast.error("Failed to delete categories.");
    } finally {
      setConfirmDeleteAllOpen(false);
    }
  }

  async function handleCurrencyChange(value: string) {
    setCurrency(value);
    await supabase.from("user_preferences").upsert({
      user_id: userId,
      currency_code: value,
    });
    toast.success("Currency updated.");
  }

  const currencyObj = currencies.find((c) => c.code === currency) || {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
  };

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
    <div className="max-w-4xl mx-auto mt-8 mb-12 space-y-8 px-4">
      {/* Header Section */}
      <Card className="border-pixel shadow-pixel bg-card">
        <CardHeader>
          <CardTitle className="pixel-font flex items-center gap-2 text-primary">
            <TrendingUp className="w-6 h-6" />
            Control Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <label className="text-sm font-medium">Active Currency</label>
            <Select
              value={currency}
              onValueChange={handleCurrencyChange}
              disabled={currencyLoading}
            >
              <SelectTrigger className="w-full md:w-[200px] border-2 shadow-[2px_2px_0_0_#000]">
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.code} ({c.symbol}) - {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2 w-full md:w-auto">
            <label className="text-sm font-medium">Quick Actions</label>
            <Button
              onClick={() => router.push(`/invoice?currency=${currency}`)}
              className="border-2 border-black shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all"
            >
              Generate Invoice
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Expense Section */}
      <Card className="border-pixel shadow-pixel bg-card">
        <CardHeader>
          <CardTitle className="pixel-font font-bold text-lg">
            Add New Transaction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleAdd}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
          >
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                placeholder="e.g. Cyber Implant"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-2 shadow-[2px_2px_0_0_#000] focus-visible:ring-0 focus-visible:border-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <Input
                placeholder="0.00"
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border-2 shadow-[2px_2px_0_0_#000] focus-visible:ring-0 focus-visible:border-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger className="border-2 shadow-[2px_2px_0_0_#000]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              className="md:col-span-4 w-full border-2 border-black shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none bg-primary text-primary-foreground hover:bg-primary/90 mt-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Record Transaction
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Budgets Column */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="border-pixel shadow-pixel h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="pixel-font text-lg">Budgets</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDeleteAllCategories}
                title="Delete All Categories"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add Category Mini Form */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newCategory || !newBudget) return;
                  const { data, error } = await supabase
                    .from("categories")
                    .insert({
                      user_id: userId,
                      name: newCategory,
                      budget: parseFloat(newBudget),
                    })
                    .select();
                  if (!error && data) {
                    setCategories([...categories, ...data]);
                    toast.success("Category added");
                  }
                  setNewCategory("");
                  setNewBudget("");
                }}
                className="flex flex-col gap-2 p-4 border-2 border-dashed border-gray-300 rounded-none bg-muted/20"
              >
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  New Budget
                </span>
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="h-8 text-sm"
                  placeholder="Category Name"
                  required
                />
                <Input
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="h-8 text-sm"
                  placeholder="Limit"
                  type="number"
                  min="0"
                  required
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="outline"
                  className="w-full border-2 border-black shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-none"
                >
                  Create
                </Button>
              </form>

              <div className="space-y-4">
                {categories.map((cat) => {
                  const spent = expenses
                    .filter((e) => e.category_id === cat.id)
                    .reduce((sum, e) => sum + e.amount, 0);
                  const percentage =
                    cat.budget > 0
                      ? Math.min((spent / cat.budget) * 100, 100)
                      : 0;
                  const isOver = spent > cat.budget;

                  return (
                    <div key={cat.id} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-bold">{cat.name}</span>
                        <span className="text-muted-foreground">
                          {currencyObj.symbol}
                          {spent} / {cat.budget}
                        </span>
                      </div>
                      <Progress
                        value={percentage}
                        className={`h-3 border border-black ${
                          isOver ? "[&>div]:bg-red-500" : "[&>div]:bg-primary"
                        }`}
                      />
                      {isOver && (
                        <div className="text-xs text-red-500 font-bold flex items-center">
                          <AlertTriangle className="w-3 h-3 mr-1" /> Over Budget
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expenses List Column */}
        <div className="space-y-6 lg:col-span-2">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Input
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border-2 shadow-[2px_2px_0_0_#000]"
            />
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                <SelectTrigger className="w-[120px] bg-white border-2 shadow-[2px_2px_0_0_#000]">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
                className="border-2 border-black shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-none"
              >
                {sortDir === "asc" ? "↑" : "↓"}
              </Button>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block rounded-none border-2 border-black shadow-pixel bg-white overflow-hidden">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow className="border-b-2 border-black hover:bg-muted">
                  <TableHead className="font-bold text-black">
                    Transaction
                  </TableHead>
                  <TableHead className="font-bold text-black">
                    Category
                  </TableHead>
                  <TableHead className="font-bold text-black text-right">
                    Amount
                  </TableHead>
                  <TableHead className="font-bold text-black text-right">
                    Date
                  </TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence initial={false}>
                  {filteredExpenses.map((expense) => (
                    <motion.tr
                      key={expense.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-b border-gray-200 hover:bg-orange-50/50"
                    >
                      <TableCell className="font-medium">
                        {expense.title}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 border border-gray-300">
                          {categories.find((c) => c.id === expense.category_id)
                            ?.name || "Uncategorized"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-bold font-mono">
                        {currencyObj.symbol}
                        {expense.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-xs">
                        {format(new Date(expense.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(expense.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredExpenses.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            <AnimatePresence initial={false}>
              {filteredExpenses.map((expense) => (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border-2 border-black shadow-[3px_3px_0_0_#000]">
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-sm">{expense.title}</h4>
                        <div className="text-xs text-muted-foreground mt-1">
                          {format(new Date(expense.created_at), "MMM d, yyyy")}{" "}
                          •
                          <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 border border-gray-200">
                            {categories.find(
                              (c) => c.id === expense.category_id
                            )?.name || "Uncategorized"}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold font-mono text-lg">
                          {currencyObj.symbol}
                          {expense.amount.toFixed(2)}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-destructive -mr-2 mt-1"
                          onClick={() => handleDelete(expense.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredExpenses.length === 0 && (
              <div className="text-center p-8 border-2 border-dashed border-gray-300 text-muted-foreground">
                No records found.
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={confirmDelete}
        title="Delete Transaction?"
        description="This action cannot be undone. Are you sure?"
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ConfirmDialog
        open={confirmDeleteAllOpen}
        onOpenChange={setConfirmDeleteAllOpen}
        onConfirm={confirmDeleteAllCategories}
        title="Reset All Budgets?"
        description="This will delete all your categories and their limits. Existing expenses will become uncategorized."
        confirmText="Reset"
        cancelText="Cancel"
      />
    </div>
  );
}
