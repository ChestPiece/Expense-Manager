"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { LoadingSpinner } from "./loading-spinner";

interface EmailConfirmationProps {
  email: string;
  onBackToLogin: () => void;
}

export function EmailConfirmation({
  email,
  onBackToLogin,
}: EmailConfirmationProps) {
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleResendEmail = async () => {
    if (resendCooldown > 0) return;

    setResendLoading(true);
    setResendStatus("idle");
    setStatusMessage(null);

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) {
        setResendStatus("error");
        setStatusMessage(error.message);
      } else {
        setResendStatus("success");
        setStatusMessage("Confirmation email resent successfully!");
        setResendCooldown(60); // 60 seconds cooldown
      }
    } catch {
      setResendStatus("error");
      setStatusMessage("An unexpected error occurred. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
      <div className="text-center mb-4">
        <h1 className="font-display text-3xl font-bold mb-2">EXPENSE.MGR</h1>
        <p className="text-muted-foreground">Check your inbox</p>
      </div>

      <Card className="border-2 border-border retro-shadow bg-card">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 border-2 border-primary/20">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl font-bold">Verify your email</CardTitle>
          <CardDescription>
            We&apos;ve sent a confirmation link to:
            <br />
            <span className="font-mono font-bold text-foreground mt-2 block">
              {email}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-sm text-muted-foreground">
            Click the link in the email to activate your account. If you
            don&apos;t see it, check your spam folder.
          </p>

          {statusMessage && (
            <div
              className={`text-sm font-medium text-center p-3 border rounded-md flex items-center justify-center gap-2 ${
                resendStatus === "success"
                  ? "bg-green-500/10 text-green-600 border-green-500/20"
                  : "bg-destructive/10 text-destructive border-destructive/20"
              }`}
            >
              {resendStatus === "success" ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              {statusMessage}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResendEmail}
              disabled={resendLoading || resendCooldown > 0}
            >
              {resendLoading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner className="h-4 w-4" />
                  <span>Sending...</span>
                </div>
              ) : resendCooldown > 0 ? (
                `Resend Email (${resendCooldown}s)`
              ) : (
                "Resend Email"
              )}
            </Button>

            <Button onClick={onBackToLogin} className="w-full font-bold">
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
