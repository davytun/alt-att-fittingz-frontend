// src/components/login-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
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
import { useLogin } from "@/hooks/api/use-auth";
import { type LoginFormData, loginSchema } from "@/lib/auth-schemas";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useLogin();

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-2xl overflow-hidden">
      <CardHeader className="space-y-8 pb-3 pt-12 bg-gradient-to-b from-white to-[#f8f9fa]">
        <Image
          src="/logo.png"
          alt="Fittingz Logo"
          width={140}
          height={140}
          className="mx-auto"
        />
        <div className="text-center space-y-3">
          <CardTitle className="text-3xl font-bold text-[#222831]">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-lg text-[#222831]/70">
            Sign in to continue managing your clients
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pt-4 pb-12 px-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-base font-bold text-[#222831]"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="hello@fittingz.com"
              autoComplete="email"
              data-invalid={!!errors.email}
              {...register("email")}
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-base font-bold text-[#222831]"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              data-invalid={!!errors.password}
              {...register("password")}
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm font-bold text-[#0F4C75] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 text-lg font-bold bg-[#0F4C75] hover:bg-[#0F4C75]/90 text-white rounded-lg"
            disabled={isSubmitting || loginMutation.isPending}
          >
            {isSubmitting || loginMutation.isPending
              ? "Signing In..."
              : "Sign In"}
          </Button>

          {/* Sign Up Link */}
          <p className="text-center text-base font-medium text-[#222831]/80">
            New to Fittingz?{" "}
            <Link
              href="/register"
              className="font-bold text-[#0F4C75] hover:underline"
            >
              Create account
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
