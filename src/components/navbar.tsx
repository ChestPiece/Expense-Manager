"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { LoadingSpinner } from "./loading-spinner";

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
    getUser();
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
      // If already on dashboard, refresh the page
      setIsRefreshing(true);
      router.refresh();
      setTimeout(() => setIsRefreshing(false), 1000); // Reset after 1 second
      return;
    }

    setIsNavigating(true);
    setActiveLink(path);
    router.push(path);
  };

  const NavLink = ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => {
    const isActive = activeLink === href || pathname === href;
    const isDashboardRefresh =
      href === "/dashboard" && pathname === "/dashboard" && isRefreshing;

    return (
      <button
        onClick={() => handleNavigation(href)}
        className={`pixel-font text-muted-foreground hover:text-primary ${
          isActive ? "text-primary" : ""
        }`}
        disabled={isNavigating || isRefreshing}
      >
        {isDashboardRefresh ? (
          <div className="flex items-center gap-2">
            <LoadingSpinner />
            <span>Refreshing...</span>
          </div>
        ) : isActive && isNavigating ? (
          <div className="flex items-center gap-2">
            <LoadingSpinner />
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
  };

  const MobileNavButton = ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => {
    const isActive = pathname === href;
    const isDashboardRefresh =
      href === "/dashboard" && pathname === "/dashboard" && isRefreshing;

    return (
      <button
        onClick={() => handleNavigation(href)}
        className="block pixel-font text-muted-foreground hover:text-primary py-2 w-full text-left"
        disabled={isNavigating || isRefreshing}
      >
        {isDashboardRefresh ? (
          <div className="flex items-center gap-2">
            <LoadingSpinner />
            <span>Refreshing...</span>
          </div>
        ) : isActive && isNavigating ? (
          <div className="flex items-center gap-2">
            <LoadingSpinner />
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
  };

  return (
 
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => handleNavigation("/")}
              className="pixel-font text-primary text-lg sm:text-xl font-bold hover:opacity-80 transition-opacity"
              disabled={isNavigating || isRefreshing}
            >
              {activeLink === "/" && isNavigating ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner />
                  <span>Loading...</span>
                </div>
              ) : (
                "EXPENSE TRACKER"
              )}
            </button>
          </div>
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {user && <NavLink href="/dashboard">Dashboard</NavLink>}
            {user ? (
              <>
                <span className="pixel-font text-muted-foreground text-sm sm:text-base truncate max-w-[150px] sm:max-w-[200px]">
                  {user.user_metadata?.full_name || user.email}
                </span>
                {mounted && (
                  <button
                    aria-label="Toggle Dark Mode"
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className="ml-2 p-2 rounded-none border-2 border-transparent hover:border-black dark:hover:border-white transition-all"
                    disabled={isNavigating || isRefreshing}
                  >
                    {theme === "dark" ? (
                      <Sun size={18} className="text-primary" />
                    ) : (
                      <Moon size={18} className="text-foreground" />
                    )}
                  </button>
                )}
                <Button
                  variant="outline"
                  className="pixel-font border-2 border-black shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-none bg-background text-foreground hover:bg-muted"
                  onClick={handleLogout}
                  disabled={isLoggingOut || isNavigating || isRefreshing}
                >
                  {isLoggingOut ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner />
                      <span>Logging out...</span>
                    </div>
                  ) : (
                    "Logout"
                  )}
                </Button>
              </>
            ) : (
              <>
                <NavLink href="/login">Login</NavLink>
                <NavLink href="/signup">Sign Up</NavLink>
                {mounted && (
                  <button
                    aria-label="Toggle Dark Mode"
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className="ml-2 p-2 rounded-none border-2 border-transparent hover:border-black dark:hover:border-white transition-all"
                    disabled={isNavigating || isRefreshing}
                  >
                    {theme === "dark" ? (
                      <Sun size={18} className="text-primary" />
                    ) : (
                      <Moon size={18} className="text-foreground" />
                    )}
                  </button>
                )}
              </>
            )}
          </div>
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-muted-foreground hover:text-primary transition-colors"
              disabled={isNavigating || isRefreshing}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="sm:hidden absolute w-full bg-background border-b border-border animate-in slide-in-from-top duration-200">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {user && (
              <MobileNavButton href="/dashboard">Dashboard</MobileNavButton>
            )}
            {user ? (
              <>
                <span className="block pixel-text text-gray-300 py-2 text-sm truncate">
                  {user.user_metadata?.full_name || user.email}
                </span>
                {mounted && (
                  <button
                    aria-label="Toggle Dark Mode"
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className="my-2 p-2 rounded-full hover:bg-gray-800 transition-colors w-full flex justify-center"
                    disabled={isNavigating || isRefreshing}
                  >
                    {theme === "dark" ? (
                      <Sun size={18} className="text-yellow-400" />
                    ) : (
                      <Moon size={18} className="text-gray-400" />
                    )}
                  </button>
                )}
                <Button
                  variant="outline"
                  className="cyber-button pixel-text w-full"
                  onClick={handleLogout}
                  disabled={isLoggingOut || isNavigating || isRefreshing}
                >
                  {isLoggingOut ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner />
                      <span>Logging out...</span>
                    </div>
                  ) : (
                    "Logout"
                  )}
                </Button>
              </>
            ) : (
              <>
                <MobileNavButton href="/login">Login</MobileNavButton>
                <MobileNavButton href="/signup">Sign Up</MobileNavButton>
                {mounted && (
                  <button
                    aria-label="Toggle Dark Mode"
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className="my-2 p-2 rounded-full hover:bg-gray-800 transition-colors w-full flex justify-center"
                    disabled={isNavigating || isRefreshing}
                  >
                    {theme === "dark" ? (
                      <Sun size={18} className="text-yellow-400" />
                    ) : (
                      <Moon size={18} className="text-gray-400" />
                    )}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
