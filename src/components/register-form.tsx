"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
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
import { useRegister } from "@/hooks/api/use-auth";
import { type RegisterFormData, registerSchema } from "@/lib/auth-schemas";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerMutation = useRegister();

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
              case "confirmPassword":
                fieldName = "confirmPassword";
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
    <Card className="w-full max-w-md mx-auto !shadow-none">
      <CardHeader className="flex flex-col items-center gap-6">
        <CardContent className="py-5">
          <Image
            src="/logo.png"
            alt="Fittingz Logo"
            width={128}
            height={128}
            className="mx-auto"
          />
        </CardContent>

        <CardTitle className="text-2xl font-bold text-center">
          Join Fittingz
        </CardTitle>
        <CardDescription className="text-center">
          Create your own Fashion Business Account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Server error message */}
          {serverError && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg animate-in slide-in-from-top-1 duration-300">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-bold text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="transition-all duration-200 text-[#222831]"
            />
            {errors.email && (
              <div className="flex items-center gap-2 text-sm text-red-600 animate-in slide-in-from-left-1 duration-200">
                <AlertCircle size={14} />
                <span>{errors.email.message}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-bold text-gray-700"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                autoComplete="new-password"
                {...register("password")}
                className="pr-10 transition-all duration-200 text-[#222831]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <div className="flex items-center gap-2 text-sm text-red-600 animate-in slide-in-from-left-1 duration-200">
                <AlertCircle size={14} />
                <span>{errors.password.message}</span>
              </div>
            )}
            <p className="text-xs text-gray-500">
              8+ characters with uppercase, lowercase, number & special
              character
            </p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-bold text-gray-700"
            >
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                autoComplete="new-password"
                {...register("confirmPassword")}
                className="pr-10 transition-all duration-200 text-[#222831]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="flex items-center gap-2 text-sm text-red-600 animate-in slide-in-from-left-1 duration-200">
                <AlertCircle size={14} />
                <span>{errors.confirmPassword.message}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="businessName"
              className="text-sm font-bold text-gray-700"
            >
              Business Name
            </Label>
            <Input
              id="businessName"
              type="text"
              placeholder="Your business name"
              {...register("businessName")}
              className="transition-all duration-200 text-[#222831]"
            />
            {errors.businessName && (
              <div className="flex items-center gap-2 text-sm text-red-600 animate-in slide-in-from-left-1 duration-200">
                <AlertCircle size={14} />
                <span>{errors.businessName.message}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="contactPhone"
              className="text-sm font-bold text-gray-700"
            >
              Contact Phone
            </Label>
            <Input
              id="contactPhone"
              type="tel"
              placeholder="Your phone number"
              {...register("contactPhone")}
              className="transition-all duration-200 text-[#222831]"
            />
            {errors.contactPhone && (
              <div className="flex items-center gap-2 text-sm text-red-600 animate-in slide-in-from-left-1 duration-200">
                <AlertCircle size={14} />
                <span>{errors.contactPhone.message}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="businessAddress"
              className="text-sm font-bold text-gray-700"
            >
              Business Address
            </Label>
            <Input
              id="businessAddress"
              type="text"
              placeholder="Your business address"
              {...register("businessAddress")}
              className="transition-all duration-200 text-[#222831]"
            />
            {errors.businessAddress && (
              <div className="flex items-center gap-2 text-sm text-red-600 animate-in slide-in-from-left-1 duration-200">
                <AlertCircle size={14} />
                <span>{errors.businessAddress.message}</span>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full font-bold hover:bg-[#0F4C75]/90"
            disabled={isSubmitting || registerMutation.isPending}
          >
            {isSubmitting || registerMutation.isPending
              ? "Creating Account..."
              : "Create Account"}
          </Button>

          <div className="text-center font-bold text-sm">
            Already have an account?
            <Link href="/login" className="text-[#0F4C75] hover:underline ml-1">
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
