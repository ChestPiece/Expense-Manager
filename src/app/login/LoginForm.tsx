"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { LoadingSpinner } from "@/components/loading-spinner";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { useSocialAuth } from "@/hooks/useSocialAuth";

interface LoginFormProps {
  onForgotPasswordClick: () => void;
}

export function LoginForm({ onForgotPasswordClick }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const { googleLoading, githubLoading, handleSocialLogin } = useSocialAuth(
    supabase,
    setError
  );

  return (
    <>
      <div className="text-center">
        <h1 className="pixel-text text-2xl sm:text-3xl font-bold text-[#ff4500] mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Sign in to continue tracking your expenses
        </p>
        {message && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-green-500 text-sm">{message}</p>
          </div>
        )}
      </div>
      <div className="mt-8 space-y-6">
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="pixel-text text-sm text-gray-400 block mb-1"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="cyber-input pixel-text w-full px-4 py-2 rounded-lg"
              required
              disabled={loading || googleLoading || githubLoading}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="pixel-text text-sm text-gray-400 block mb-1"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="cyber-input pixel-text w-full px-4 py-2 rounded-lg"
              required
              disabled={loading || googleLoading || githubLoading}
            />
          </div>
          {error && (
            <div className="pixel-text text-red-500 text-sm text-center bg-red-500/10 p-2 rounded-lg">
              {error}
            </div>
          )}
          <Button
            type="submit"
            className="cyber-button pixel-text w-full py-2 text-sm sm:text-base relative"
            disabled={loading || googleLoading || githubLoading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <LoadingSpinner className="w-5 h-5" />
                <span>Logging in...</span>
              </div>
            ) : (
              "Login"
            )}
          </Button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-black text-gray-400">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="cyber-button pixel-text w-full py-2 text-sm sm:text-base relative"
            onClick={() => handleSocialLogin("google")}
            disabled={loading || googleLoading || githubLoading}
          >
            {googleLoading ? (
              <div className="flex items-center justify-center gap-2">
                <LoadingSpinner className="w-5 h-5" />
                <span>Connecting to Google...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <GoogleIcon />
                <span>Google</span>
              </div>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="cyber-button pixel-text w-full py-2 text-sm sm:text-base relative"
            onClick={() => handleSocialLogin("github")}
            disabled={loading || googleLoading || githubLoading}
          >
            {githubLoading ? (
              <div className="flex items-center justify-center gap-2">
                <LoadingSpinner className="w-5 h-5" />
                <span>Connecting to GitHub...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <GithubIcon />
                <span>GitHub</span>
              </div>
            )}
          </Button>
        </div>
        <div className="text-center space-y-2">
          <div>
            <span className="pixel-text text-sm text-gray-400">
              Don&apos;t have an account?{" "}
            </span>
            <Link
              href="/signup"
              className="pixel-text text-[#ff4500] hover:underline"
            >
              Sign Up
            </Link>
          </div>
          <div>
            <Link
              href="/reset-password"
              className="pixel-text text-sm text-[#ff4500] hover:underline"
              onClick={(e) => {
                e.preventDefault();
                onForgotPasswordClick();
              }}
            >
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
