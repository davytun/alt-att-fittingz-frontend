"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
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
import { useRegisterMutation } from "@/features/auth/hooks/use-auth-mutation";
import {
  type RegisterFormData,
  registerSchema,
} from "@/features/auth/schemas/auth-schemas";

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const [serverError, setServerError] = useState<string>("");

  const registerMutation = useRegisterMutation();

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(""); // Clear previous errors

    try {
      await registerMutation.mutateAsync(data);
      // Only redirects on success via the mutation's onSuccess callback
    } catch (error: unknown) {
      console.log("Form error caught:", error);

      // Parse the error - it might be a string or object
      let parsedError: {
        message?: string;
        errors?: Array<{ param?: string; msg?: string }>;
      };

      if (typeof error === "object" && error !== null) {
        parsedError = error as {
          message?: string;
          errors?: Array<{ param?: string; msg?: string }>;
        };
      } else {
        parsedError = { message: String(error) };
      }

      // Handle email already exists error specifically
      if (parsedError.message?.includes("already exists")) {
        setError("email", {
          type: "server",
          message:
            "An account with this email already exists. Please use a different email or try logging in.",
        });
      }
      // Handle other specific field errors from the API
      else if (parsedError.errors && Array.isArray(parsedError.errors)) {
        parsedError.errors.forEach((err: { param?: string; msg?: string }) => {
          if (err?.param && err?.msg) {
            // Map API field names to form field names
            let fieldName: keyof RegisterFormData;
            switch (err.param) {
              case "email":
                fieldName = "email";
                break;
              case "password":
                fieldName = "password";
                break;
              case "businessName":
                fieldName = "businessName";
                break;
              case "contactPhone":
                fieldName = "contactPhone";
                break;
              case "businessAddress":
                fieldName = "businessAddress";
                break;
              default:
                return; // Skip unknown fields
            }

            setError(fieldName, {
              type: "server",
              message: err.msg,
            });
          }
        });
      }
      // Handle general error messages
      else if (parsedError.message) {
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
          Create Account
        </CardTitle>
        <CardDescription className="text-center">
          Enter your business information to create an admin account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Server error message */}
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
              placeholder="admin@example.com"
              {...register("email")}
              error={errors.email?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              error={errors.password?.message}
            />
            <p className="text-xs text-gray-500">
              Must be at least 8 characters with uppercase, lowercase, number,
              and special character
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              type="text"
              placeholder="Your Business Name"
              {...register("businessName")}
              error={errors.businessName?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone">Contact Phone</Label>
            <Input
              id="contactPhone"
              type="tel"
              placeholder="1234567890"
              {...register("contactPhone")}
              error={errors.contactPhone?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessAddress">Business Address</Label>
            <Input
              id="businessAddress"
              type="text"
              placeholder="123 Main St"
              {...register("businessAddress")}
              error={errors.businessAddress?.message}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || registerMutation.isPending}
          >
            {isSubmitting || registerMutation.isPending
              ? "Creating Account..."
              : "Create Account"}
          </Button>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
