"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { useForgotPassword } from "@/hooks/api/use-auth";
import {
  type ForgotPasswordFormData,
  forgotPasswordSchema,
} from "@/lib/auth-schemas";

export function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const [serverError, setServerError] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const forgotPasswordMutation = useForgotPassword();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setServerError("");

    try {
      await forgotPasswordMutation.mutateAsync(data);
      setIsSuccess(true);
    } catch (error: unknown) {
      console.log("Forgot password error caught:", error);

      let parsedError = error;
      if (typeof error === "string") {
        try {
          parsedError = JSON.parse(error);
        } catch {
          parsedError = { message: error };
        }
      }

      if (
        parsedError &&
        typeof parsedError === "object" &&
        "message" in parsedError &&
        typeof parsedError.message === "string"
      ) {
        setServerError(parsedError.message);
      } else {
        setServerError("An unexpected error occurred. Please try again.");
      }
    }
  };

  // Auto-redirect when success state is true
  useEffect(() => {
    if (isSuccess) {
      const email = getValues("email");
      router.push(`/verify-reset-code?email=${encodeURIComponent(email)}`);
    }
  }, [isSuccess, router, getValues]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-4 text-center">
        <div className="py-4">
          <Image
            src="/logo.png"
            alt="Fittingz Logo"
            width={128}
            height={128}
            className="mx-auto"
          />
        </div>
        <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
        <CardDescription className="text-center text-lg">
          Don’t worry we've got you covered. Enter the email you used to
          register
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {serverError}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your registered email"
              {...register("email")}
            />
          </div>

          <Button
            type="submit"
            className="w-full font-bold hover:bg-[#0F4C75]/90"
            disabled={isSubmitting || forgotPasswordMutation.isPending}
          >
            {isSubmitting || forgotPasswordMutation.isPending
              ? "Sending Code..."
              : "Reset password"}
          </Button>

          <div className="text-center text-sm">
            <Link href="/login" className="text-[#0F4C75] font-bold underline">
              Back to Login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
