"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    getUser();

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleNavigation = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") {
      setIsRefreshing(true);
      router.refresh();
      setTimeout(() => setIsRefreshing(false), 1000);
      return;
    }

    setIsNavigating(true);
    setActiveLink(path);
    router.push(path);
  };

  // Reset navigating state when pathname changes
  useEffect(() => {
    setIsNavigating(false);
    setIsMenuOpen(false); // Close mobile menu on nav
  }, [pathname]);

  const NavLink = ({
    href,
    children,
    mobile = false,
  }: {
    href: string;
    children: React.ReactNode;
    mobile?: boolean;
  }) => {
    const isActive = activeLink === href || pathname === href;
    const isDashboardRefresh =
      href === "/dashboard" && pathname === "/dashboard" && isRefreshing;
    const isLoading = (isActive && isNavigating) || isDashboardRefresh;

    return (
      <Button
        variant={isActive ? "default" : "ghost"}
        onClick={() => handleNavigation(href)}
        isLoading={isLoading}
        // disabled state checks are now partly handled by isLoading inside Button,
        // but we still want to block if GLOBAL nav/refresh/logout is happening
        disabled={(isNavigating || isRefreshing) && !isLoading}
        className={`w-full justify-start ${!mobile ? "sm:w-auto" : ""}`}
      >
        {children}
      </Button>
    );
  };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <button
              onClick={() => handleNavigation("/")}
              className="font-display text-2xl font-bold text-primary hover:opacity-80 transition-opacity flex items-center gap-2"
              disabled={isNavigating || isRefreshing}
            >
              {/* This custom button logic is fine to keep separate from Shadcn Button for now */}
              {activeLink === "/" && isNavigating
                ? // We keep pure loading spinner here or replace with new button eventually
                  "EXPENSE.MGR..."
                : "EXPENSE.MGR"}
            </button>
          </div>

          {/* Desktop Nav */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {user && <NavLink href="/dashboard">Dashboard</NavLink>}
            {user ? (
              <>
                <span className="font-mono text-xs text-muted-foreground truncate max-w-[150px]">
                  {user.user_metadata?.full_name || user.email}
                </span>
                {mounted && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Toggle Dark Mode"
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    disabled={isNavigating || isRefreshing}
                  >
                    {theme === "dark" ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </Button>
                )}
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  isLoading={isLoggingOut}
                  disabled={isNavigating || isRefreshing}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <NavLink href="/login">Login</NavLink>
                <NavLink href="/signup">Sign Up</NavLink>
                {mounted && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Toggle Dark Mode"
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                  >
                    {theme === "dark" ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              disabled={isNavigating || isRefreshing}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden absolute w-full bg-background border-b border-border p-4 space-y-3 shadow-lg">
          {user ? (
            <>
              <div className="px-2 py-1 font-mono text-xs text-muted-foreground border-b border-border/50 pb-2 mb-2">
                Signed in as: <br />
                {user.user_metadata?.full_name || user.email}
              </div>
              <NavLink href="/dashboard" mobile>
                Dashboard
              </NavLink>
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={handleLogout}
                isLoading={isLoggingOut}
                disabled={isNavigating || isRefreshing}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <NavLink href="/login" mobile>
                Login
              </NavLink>
              <NavLink href="/signup" mobile>
                Sign Up
              </NavLink>
            </>
          )}
          {mounted && (
            <Button
              variant="outline"
              className="w-full justify-start mt-2"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="mr-2 h-4 w-4" />
              ) : (
                <Moon className="mr-2 h-4 w-4" />
              )}
              Switch to {theme === "dark" ? "Light" : "Dark"} Mode
            </Button>
          )}
        </div>
      )}
    </nav>
  );
}
