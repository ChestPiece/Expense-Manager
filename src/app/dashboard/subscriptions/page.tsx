import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SubscriptionList } from "@/components/dashboard/subscription-list";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default async function SubscriptionsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Calculate total monthly cost
  const totalMonthly = (subscriptions || []).reduce((acc, sub) => {
    if (sub.billing_cycle === "monthly") {
      return acc + Number(sub.amount);
    } else {
      return acc + Number(sub.amount) / 12;
    }
  }, 0);

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Subscriptions"
        description={`Total Fixed Monthly Cost: $${totalMonthly.toFixed(2)}`}
      />
      <SubscriptionList
        initialSubscriptions={subscriptions || []}
        userId={user.id}
      />
    </div>
  );
}
