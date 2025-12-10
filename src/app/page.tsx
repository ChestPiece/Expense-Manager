"use client";
import { MainLayout } from "@/components/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Wallet, TrendingUp, Globe } from "lucide-react";

export default function WelcomePage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden mb-8 sm:mb-12 min-h-[50vh] flex flex-col justify-center items-center">
        <div className="text-center pt-8 sm:pt-12 max-w-4xl mx-auto px-4">
          <h1 className="pixel-font break-words text-1xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            <span className="text-primary">TRACK</span>
            <span className="text-foreground mx-4">YOUR</span>
            <span className="text-primary">EXPENSES</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 max-w-xs sm:max-w-md md:max-w-2xl mx-auto break-words font-medium">
            Take control of your finances with our cyberpunk-themed expense
            tracker. Monitor your spending, set budgets, and achieve your
            financial goals.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup">
              <Button
                size="lg"
                className="pixel-font w-full sm:w-64 border-2 border-black shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none hover:bg-primary/90 text-lg py-6"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="secondary"
                className="pixel-font w-full sm:w-64 border-2 border-black shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none hover:bg-secondary/80 text-lg py-6"
              >
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-16 px-4 max-w-6xl mx-auto">
        <Card className="border-2 border-black shadow-pixel hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all bg-card">
          <CardHeader>
            <Wallet className="w-10 h-10 text-primary mb-2" />
            <CardTitle className="pixel-font text-primary text-xl font-bold">
              Category Budgeting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Organize expenses by categories and set limits. We'll warn you
              when you're close to overspending.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-black shadow-pixel hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all bg-card">
          <CardHeader>
            <TrendingUp className="w-10 h-10 text-primary mb-2" />
            <CardTitle className="pixel-font text-primary text-xl font-bold">
              Real-time Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Monitor your spending habits with instant updates. Visual progress
              bars keep you on track.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-black shadow-pixel hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all bg-card">
          <CardHeader>
            <Globe className="w-10 h-10 text-primary mb-2" />
            <CardTitle className="pixel-font text-primary text-xl font-bold">
              Multi-currency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Track expenses in your preferred currency. Switch between USD,
              EUR, GBP, and more instantly.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
