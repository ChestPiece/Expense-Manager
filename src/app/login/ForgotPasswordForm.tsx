"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/loading-spinner";

interface ForgotPasswordFormProps {
  onCancel: () => void;
}

export function ForgotPasswordForm({ onCancel }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setMessage("Password reset link sent to your email.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h1 className="pixel-font text-2xl sm:text-3xl font-bold text-primary mb-2">
          Forgot Password
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Enter your email to receive a password reset link
        </p>
        {message && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-green-500 text-sm pixel-font">{message}</p>
          </div>
        )}
        {error && (
          <div className="text-destructive text-sm text-center font-medium bg-destructive/10 p-2 rounded-lg pixel-font">
            {error}
          </div>
        )}
      </div>
      <div className="mt-8 space-y-6">
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="pixel-font text-xs uppercase text-muted-foreground block mb-1"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-2 border-border focus-visible:ring-0 focus-visible:border-primary w-full px-4 py-2 rounded-none"
              required
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            className="w-full pixel-font border-pixel shadow-pixel active:translate-y-1 active:shadow-none transition-all hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <LoadingSpinner className="w-5 h-5" />
                <span>Sending Link...</span>
              </div>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>
        <div className="text-center">
          <Button
            variant="link"
            className="pixel-font text-primary hover:underline px-0"
            onClick={onCancel}
            disabled={loading}
          >
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
}
