import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";
import { AuthProvider } from "@/context/auth-provider";

export const metadata: Metadata = {
  title: "Sign In — Trove",
  description: "Sign in to your Trove investment portfolio dashboard.",
};

export default function LoginPage() {
  return (
    <AuthProvider isProtected>
      <div className="min-h-screen flex items-center justify-center bg-(--page-bg) px-4 py-8 relative overflow-hidden">
        {/* Background decorative blobs */}
        <div className="absolute top-[-5%] left-0 lg:top-[-12%] lg:left-[-5%] w-[200px] h-[200px] lg:w-[400px] lg:h-[400px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-[-16%] right-[-11%] w-[250px] h-[250px] lg:w-[350px] lg:h-[350px] rounded-full bg-[#00B6DF]/25 blur-3xl" />

        <LoginForm />
      </div>
    </AuthProvider>
  );
}
