"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Navbar } from "@/components/navbar";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setMessage(
        "Your password has been reset successfully. You can now log in with your new password.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-4">
            <h1 className="font-display text-3xl font-bold mb-2">
              EXPENSE.MGR
            </h1>
            <p className="text-muted-foreground">Secure your account</p>
          </div>
          <Card className="border-2 border-border retro-shadow bg-card">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Reset Password
              </CardTitle>
              <CardDescription>Enter your new password below</CardDescription>
            </CardHeader>
            <CardContent>
              {message ? (
                <div className="text-center space-y-4">
                  <div className="text-sm font-bold text-green-600 p-4 border border-green-600/20 bg-green-500/10 rounded-none">
                    {message}
                  </div>
                  <Button
                    className="w-full font-bold"
                    onClick={() => router.push("/login")}
                  >
                    Go to Login
                  </Button>
                </div>
              ) : (
                <form onSubmit={handlePasswordReset}>
                  <div className="flex flex-col gap-6">
                    {error && (
                      <div className="text-sm font-bold text-destructive text-center p-2 border border-destructive/20 bg-destructive/10">
                        {error}
                      </div>
                    )}
                    <div className="grid gap-3">
                      <Label htmlFor="password">New Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="rounded-none border-border"
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="confirm-password">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="rounded-none border-border"
                        required
                        disabled={loading}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full font-bold"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <LoadingSpinner className="h-4 w-4" />
                          <span>Resetting Password...</span>
                        </div>
                      ) : (
                        "Reset Password"
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
