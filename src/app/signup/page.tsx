"use client";
import { Navbar } from "@/components/navbar";
import { SignUpForm } from "@/components/signup-form";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <SignUpForm />
        </div>
      </main>
    </div>
  );
}
