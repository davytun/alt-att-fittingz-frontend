"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
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
import { useResetPassword } from "@/hooks/api/use-auth";
import {
  type ResetPasswordFormData,
  resetPasswordSchema,
} from "@/lib/auth-schemas";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const code = searchParams.get("code") || "";

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: email,
      resetCode: code,
    },
  });

  const [serverError, setServerError] = useState<string>("");
  const resetPasswordMutation = useResetPassword();

  const onSubmit = async (data: ResetPasswordFormData) => {
    setServerError("");

    try {
      await resetPasswordMutation.mutateAsync(data);
    } catch (error: unknown) {
      console.log("Reset password error caught:", error);

      let parsedError: { message?: string } = {};
      if (typeof error === "string") {
        try {
          parsedError = JSON.parse(error);
        } catch {
          parsedError = { message: error };
        }
      } else if (error && typeof error === "object" && "message" in error) {
        parsedError = error as { message: string };
      }

      if (parsedError.message) {
        setServerError(parsedError.message);
      } else {
        setServerError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Set New Password
        </CardTitle>
        <CardDescription className="text-center">
          Create a new password for your account
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
              value={email}
              disabled
              className="bg-gray-50"
              {...register("email")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resetCode">Reset Code</Label>
            <Input
              id="resetCode"
              type="text"
              value={code}
              disabled
              className="bg-gray-50 font-mono"
              {...register("resetCode")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Enter your new password"
              autoComplete="new-password"
              {...register("newPassword")}

            />
            <p className="text-xs text-gray-500">
              Must be at least 8 characters with uppercase, lowercase, number,
              and special character
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              autoComplete="new-password"
              {...register("confirmPassword")}

            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || resetPasswordMutation.isPending}
          >
            {isSubmitting || resetPasswordMutation.isPending
              ? "Resetting Password..."
              : "Reset Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
