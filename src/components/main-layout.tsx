"use client";

import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";
import { PageTransition } from "@/components/ui/page-transition";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  showNavbar?: boolean;
}

export function MainLayout({
  children,
  className,
  showNavbar = true,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col">
      <InteractiveGridPattern
        width={20}
        height={20}
        squares={[80, 80]}
        className={cn(
          "[mask-image:radial-gradient(100vh_circle_at_center,white,transparent)]",
          "inset-0 h-full w-full"
        )}
        squaresClassName="hover:fill-primary"
      />
      {showNavbar && <Navbar />}
      <main
        className={cn(
          "flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10 pointer-events-none [&>*]:pointer-events-auto",
          className
        )}
      >
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
