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
import { poppins } from "@/components/ui/fonts";
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardContent className="py-6">
          <Image
            src="/logo.png"
            alt="Fittingz Logo"
            width={128}
            height={128}
            className="mx-auto"
          />
        </CardContent>
        <CardTitle className="text-2xl font-bold text-center">
          Welcome Back to Fittingz
        </CardTitle>
        <CardDescription
          className={`${poppins.className} text-center text-[#222831]`}
        >
          Sign in to manage your fashion clients
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-bold">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              {...register("email")}
              error={errors.email?.message}
              className="font-normal text-[#222831]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="font-bold">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              {...register("password")}
              error={errors.password?.message}
              className="font-normal text-[#222831]"
            />
          </div>
          <div className="text-end">
            <Link
              href="/forgot-password"
              className="text-sm font-bold hover:underline text-[#0F4C75]"
            >
              Forgot your password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full font-bold hover:bg-[#0F4C75]/90"
            disabled={isSubmitting || loginMutation.isPending}
          >
            {isSubmitting || loginMutation.isPending
              ? "Signing In..."
              : "Sign In"}
          </Button>

          <div className={`${poppins.className} text-center font-medium`}>
            Don't have an account?
            <Link
              href="/register"
              className="text-[#0F4C75] font-bold hover:underline ml-1 "
            >
              Sign up
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
