"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/callback`,
          queryParams: { access_type: "offline", prompt: "consent" },
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setGithubLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setGithubLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-pixel shadow-pixel bg-card">
        <CardHeader className="text-center">
          <CardTitle className="pixel-font text-xl text-primary">
            Welcome back
          </CardTitle>
          <CardDescription>
            Login with your Apple or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <FieldGroup>
              <Field>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading || googleLoading || githubLoading}
                    className="border-2 border-black shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-none"
                  >
                    {googleLoading ? <LoadingSpinner /> : <GoogleIcon />}
                    <span className="ml-2">Google</span>
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleGithubLogin}
                    disabled={loading || googleLoading || githubLoading}
                    className="border-2 border-black shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-none"
                  >
                    {githubLoading ? <LoadingSpinner /> : <GithubIcon />}
                    <span className="ml-2">GitHub</span>
                  </Button>
                </div>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card pixel-font text-xs uppercase text-muted-foreground">
                Or continue with
              </FieldSeparator>
              <Field>
                <FieldLabel
                  htmlFor="email"
                  className="pixel-font text-xs uppercase text-muted-foreground"
                >
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || googleLoading || githubLoading}
                  className="border-2 border-black shadow-[2px_2px_0_0_#000] focus-visible:ring-0 focus-visible:border-primary"
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel
                    htmlFor="password"
                    className="pixel-font text-xs uppercase text-muted-foreground"
                  >
                    Password
                  </FieldLabel>
                  <a
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline text-primary"
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
                  className="border-2 border-black shadow-[2px_2px_0_0_#000] focus-visible:ring-0 focus-visible:border-primary"
                />
              </Field>
              {error && (
                <div className="text-sm text-destructive text-center font-medium">
                  {error}
                </div>
              )}
              <Field>
                <Button
                  type="submit"
                  disabled={loading || googleLoading || githubLoading}
                  className="w-full pixel-font border-2 border-black shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none bg-primary text-primary-foreground hover:bg-primary/90"
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
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <a
                    href="/signup"
                    className="underline underline-offset-4 text-primary font-medium"
                  >
                    Sign up
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline">
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
}
