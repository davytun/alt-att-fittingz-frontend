"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useVerifyEmailMutation } from "@/features/auth/hooks/use-auth-mutation";
import {
  type VerifyEmailFormData,
  verifyEmailSchema,
} from "@/features/auth/schemas/auth-schemas";

interface VerifyEmailFormProps {
  email: string;
}

export function VerifyEmailForm({ email }: VerifyEmailFormProps) {
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: email,
      verificationCode: "",
    },
  });

  const [serverError, setServerError] = useState<string>("");

  const verifyEmailMutation = useVerifyEmailMutation();

  const onSubmit = async () => {
    setServerError("");
    try {
      // Combine the code array into a string
      const code = verificationCode.join("");
      await verifyEmailMutation.mutateAsync({ email, verificationCode: code });
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message: unknown }).message)
          : "Verification failed. Please try again.";
      setServerError(message);
    }
  };

  // Proper ref callback with correct TypeScript typing
  const setInputRef = useCallback(
    (index: number) => (element: HTMLInputElement | null) => {
      inputRefs.current[index] = element;
    },
    [],
  );

  const handleCodeChange = (index: number, value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, "");

    const newCode = [...verificationCode];
    newCode[index] = numericValue.slice(0, 1); // Only take first character
    setVerificationCode(newCode);

    // Update the form value
    setValue("verificationCode", newCode.join(""), { shouldValidate: true });

    // Auto-advance to next input
    if (numericValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      // Move to previous input on backspace
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (pasteData.length === 6) {
      const newCode = pasteData.split("").slice(0, 6);
      setVerificationCode(newCode);
      setValue("verificationCode", newCode.join(""), { shouldValidate: true });
      inputRefs.current[5]?.focus(); // Focus last input
    }
  };

  return (
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
        />
        <p className="text-xs text-gray-500">
          We sent a verification code to this email address
        </p>
      </div>

      <div className="space-y-2">
        <Label>Verification Code</Label>
        <div className="flex space-x-2">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <Input
              key={index}
              ref={setInputRef(index)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={verificationCode[index]}
              className="text-center font-mono text-lg h-12 w-12"
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              autoComplete="one-time-code"
            />
          ))}
        </div>
        {errors.verificationCode && (
          <p className="text-sm text-red-600">
            {errors.verificationCode.message}
          </p>
        )}
        <p className="text-xs text-gray-500">
          Enter the 6-digit code from your email
        </p>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || verifyEmailMutation.isPending}
      >
        {isSubmitting || verifyEmailMutation.isPending
          ? "Verifying..."
          : "Verify Email"}
      </Button>
    </form>
  );
}
