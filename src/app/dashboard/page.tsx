import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard/dashboard-content";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch initial data in parallel
  const [expensesRes, categoriesRes, currenciesRes, userPrefRes] =
    await Promise.all([
      supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase.from("categories").select("*").eq("user_id", user.id),
      supabase.from("currencies").select("*"),
      supabase
        .from("user_preferences")
        .select("currency_code")
        .eq("user_id", user.id)
        .single(),
    ]);

  const expenses = expensesRes.data || [];
  const categories = categoriesRes.data || [];
  const currencies = currenciesRes.data || [];
  const initialCurrency = userPrefRes.data?.currency_code || "USD";

  return (
    <DashboardClient
      initialUserId={user.id}
      initialExpenses={expenses}
      initialCategories={categories}
      initialCurrency={initialCurrency}
      initialCurrencies={currencies}
    />
  );
}
