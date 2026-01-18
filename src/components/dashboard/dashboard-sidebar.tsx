"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Receipt,
  Settings,
  PieChart,
  Home,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function DashboardSidebar({ className, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const links = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/transactions", label: "Transactions", icon: Receipt },
    // { href: "/dashboard/budgets", label: "Budgets", icon: PieChart },
    // { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-card border-r-2 border-border",
        className,
      )}
    >
      <div className="p-6 border-b-2 border-border">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-2xl font-bold text-primary"
        >
          <Home className="h-6 w-6" />
          <span>EXPENSE.MGR</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-bold font-mono transition-all border-2",
                isActive
                  ? "bg-primary text-primary-foreground border-border retro-shadow shadow-none translate-x-[1px] translate-y-[1px]"
                  : "bg-background text-muted-foreground border-transparent hover:border-border hover:retro-shadow",
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t-2 border-border space-y-4">
        <Button
          variant="destructive"
          className="w-full justify-start font-mono text-xs"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          LOGOUT
        </Button>
        <p className="text-[10px] font-mono text-muted-foreground text-center opacity-50">
          v1.0.0-RETRO
        </p>
      </div>
    </div>
  );
}
