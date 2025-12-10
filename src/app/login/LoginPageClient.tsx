"use client";

import { useState } from "react";
import { MainLayout } from "@/components/main-layout";
import { LoginForm } from "@/components/login-form";
import { Suspense } from "react";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { Card, CardContent } from "@/components/ui/card";

export function LoginPageClient() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <MainLayout className="flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-md px-4">
        <Suspense
          fallback={
            <div className="text-center font-mono">Loading form...</div>
          }
        >
          {showForgotPassword ? (
            <Card className="border-2 border-black shadow-pixel bg-card/95 backdrop-blur">
              <CardContent className="p-8">
                <ForgotPasswordForm
                  onCancel={() => setShowForgotPassword(false)}
                />
              </CardContent>
            </Card>
          ) : (
            <LoginForm
              onForgotPasswordClick={() => setShowForgotPassword(true)}
            />
          )}
        </Suspense>
      </div>
    </MainLayout>
  );
}
