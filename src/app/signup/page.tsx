import { MainLayout } from "@/components/main-layout";
import { SignUpForm } from "@/components/signup-form";

export default function SignUpPage() {
  return (
    <MainLayout className="flex items-center justify-center">
      <div className="w-full max-w-md">
        <SignUpForm />
      </div>
    </MainLayout>
  );
}
