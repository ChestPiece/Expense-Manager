"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ExpenseList } from "@/components/expense-list";
import { LoadingSpinner } from "@/components/loading-spinner";

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id || null);
    }
    getUser();
  }, [supabase]);

  if (!userId) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <ExpenseList userId={userId} />
    </div>
  );
}
