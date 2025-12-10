"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { LoadingSpinner } from "./loading-spinner";
import { GoogleIcon, GithubIcon } from "./social-icons";

export interface LoginFormProps extends React.ComponentProps<"div"> {
  onForgotPasswordClick?: () => void;
}

export function LoginForm({
  className,
  onForgotPasswordClick,
  ...props
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          setError("Please verify your email before logging in");
        } else if (error.message.includes("Invalid login credentials")) {
          setError("Invalid email or password");
        } else {
          setError(error.message);
        }
        return;
      }

      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      // First check if the user exists with email/password
      const {
        data: { users },
      } = await supabase.auth.admin.listUsers();
      const existingUser = users?.find((user) => user.email === email);

      if (existingUser && !existingUser.app_metadata.provider) {
        setError(
          "This email is registered with password. Please use email/password login."
        );
        return;
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          setError("Please verify your email before logging in");
        } else {
          setError(error.message);
        }
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setGithubLoading(true);
    setError(null);

    try {
      // First check if the user exists with email/password
      const {
        data: { users },
      } = await supabase.auth.admin.listUsers();
      const existingUser = users?.find((user) => user.email === email);

      if (existingUser && !existingUser.app_metadata.provider) {
        setError(
          "This email is registered with password. Please use email/password login."
        );
        return;
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/callback`,
        },
      });

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          setError("Please verify your email before logging in");
        } else {
          setError(error.message);
        }
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setGithubLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="welcome-message text-center mb-8">
        <h1 className="pixel-font text-xl mb-2 text-primary">
          Welcome to Expense Tracker
        </h1>
        <p className="text-lg text-muted-foreground">
          Sign in to see the real action
        </p>
      </div>
      <Card className="border-pixel shadow-pixel bg-card">
        <CardHeader>
          <CardTitle className="pixel-font text-lg text-primary">
            Login to your account
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              {error && (
                <div className="text-sm text-destructive text-center font-medium">
                  {error}
                </div>
              )}
              <div className="grid gap-3">
                <Label
                  htmlFor="email"
                  className="pixel-font text-xs uppercase text-muted-foreground"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || googleLoading || githubLoading}
                  className="border-2 border-border focus-visible:ring-0 focus-visible:border-primary"
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label
                    htmlFor="password"
                    className="pixel-font text-xs uppercase text-muted-foreground"
                  >
                    Password
                  </Label>
                  <a
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-primary"
                    onClick={(e) => {
                      if (onForgotPasswordClick) {
                        e.preventDefault();
                        onForgotPasswordClick();
                      }
                    }}
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading || googleLoading || githubLoading}
                  className="border-2 border-border focus-visible:ring-0 focus-visible:border-primary"
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full pixel-font border-pixel shadow-pixel active:translate-y-1 active:shadow-none transition-all hover:bg-primary/90"
                  disabled={loading || googleLoading || githubLoading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner />
                      <span>Logging in...</span>
                    </div>
                  ) : (
                    "Login"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full pixel-font border-pixel shadow-pixel active:translate-y-1 active:shadow-none transition-all"
                  onClick={handleGoogleLogin}
                  disabled={loading || googleLoading || githubLoading}
                >
                  {googleLoading ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner />
                      <span>Connecting to Google...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <GoogleIcon />
                      <span>Login with Google</span>
                    </div>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full pixel-font border-pixel shadow-pixel active:translate-y-1 active:shadow-none transition-all"
                  onClick={handleGithubLogin}
                  disabled={loading || googleLoading || githubLoading}
                >
                  {githubLoading ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner />
                      <span>Connecting to GitHub...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <GithubIcon />
                      <span>Login with GitHub</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a
                href="/signup"
                className="underline underline-offset-4 text-primary font-medium"
              >
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
