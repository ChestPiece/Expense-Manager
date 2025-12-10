"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MainLayout } from "@/components/main-layout";
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

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="pixel-text text-2xl sm:text-3xl md:text-4xl text-[#ff4500] font-bold mb-4">
            Dashboard
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Track and manage your expenses in real-time. View your spending
            patterns and stay on top of your budget.
          </p>
        </div>
        {userId ? (
          <div className="bg-card/80 backdrop-blur-sm border-2 border-black shadow-pixel rounded-xl p-4 sm:p-6">
            <ExpenseList userId={userId} />
          </div>
        ) : (
          <div className="text-center pixel-font text-lg text-primary bg-card/80 backdrop-blur-sm border-2 border-black shadow-pixel rounded-xl p-8">
            <LoadingSpinner className="mx-auto mb-4" />
            <p>Loading your data...</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
