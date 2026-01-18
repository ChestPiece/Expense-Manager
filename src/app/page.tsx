"use client";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 flex flex-col justify-center py-16 sm:py-24 border-b-2 border-border bg-muted/20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-primary block sm:inline">TRACK</span>{" "}
              <span className="text-foreground">YOUR</span>{" "}
              <span className="text-primary block sm:inline">EXPENSES</span>
            </h1>
            <p className="font-mono text-base sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Take control of your finances with our retro-styled expense
              tracker. Monitor your spending, set budgets, and achieve your
              financial goals with style.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-lg px-8"
                >
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-2 border-border retro-shadow bg-card hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200">
                <CardHeader>
                  <CardTitle className="font-display text-xl text-primary">
                    Category Budgeting
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Organize expenses by categories and set budgets for each to
                    keep your spending in check.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 border-border retro-shadow bg-card hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200">
                <CardHeader>
                  <CardTitle className="font-display text-xl text-primary">
                    Real-time Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Monitor your spending in real-time with dynamic progress
                    bars and visual indicators.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 border-border retro-shadow bg-card hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200">
                <CardHeader>
                  <CardTitle className="font-display text-xl text-primary">
                    Simple & Fast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Designed for speed and simplicity. No complex charts, just
                    the numbers you need.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
