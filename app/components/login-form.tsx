"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/validations/login.validation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/auth.store";

import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/auth.service";

export function LoginForm() {
  const router = useRouter();
  const { login: setAuthUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (email) => {
      setAuthUser(email);
      router.push("/dashboard");
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutate(data.email);
  };

  return (
    <div className="w-full max-w-[420px] mx-auto">
      <div className="bg-card rounded-lg border border-border p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 rounded-md bg-primary flex items-center justify-center">
            <span className="text-xl font-bold text-primary-foreground">T</span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-semibold text-foreground mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            type="email"
            label="Email address"
            placeholder="name@example.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register("password")}
          />

          <Button
            type="submit"
            className="w-full h-11 rounded-md text-sm font-semibold"
            isLoading={isPending}
          >
            Sign in
          </Button>
        </form>

        {/* Forgot password */}
        <div className="mt-4 text-center">
          <Button variant="link" className="text-sm text-primary font-medium">
            Forgot password?
          </Button>
        </div>

        <div className="my-6">
          <Separator />
        </div>

        {/* Create account */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-3">
            Don&apos;t have an account?
          </p>
          <Button
            variant="outline"
            className="w-full h-11 rounded-md text-sm font-semibold"
          >
            Create a Trove account
          </Button>
        </div>
      </div>
    </div>
  );
}
