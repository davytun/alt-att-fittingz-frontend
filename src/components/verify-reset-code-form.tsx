"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
import { useVerifyResetCode } from "@/hooks/api/use-auth";
import {
  type VerifyResetCodeFormData,
  verifyResetCodeSchema,
} from "@/lib/auth-schemas";

export function VerifyResetCodeForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";

  const [resetCode, setResetCode] = useState(["", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<VerifyResetCodeFormData>({
    resolver: zodResolver(verifyResetCodeSchema),
    defaultValues: {
      email: email,
      resetCode: "",
    },
  });

  const [serverError, setServerError] = useState<string>("");
  const verifyResetCodeMutation = useVerifyResetCode();

  // Update form value when resetCode changes
  useEffect(() => {
    const code = resetCode.join("");
    setValue("resetCode", code, { shouldValidate: true });
  }, [resetCode, setValue]);

  const onSubmit = async (formData: VerifyResetCodeFormData) => {
    setServerError("");

    // Ensure we have a complete 4-digit code
    const code = resetCode.join("");
    if (code.length !== 4) {
      setServerError("Please enter a complete 4-digit code");
      return;
    }

    try {
      await verifyResetCodeMutation.mutateAsync({
        email: formData.email,
        resetCode: code,
      });

      // On success, redirect to reset password page with email and code
      router.push(
        `/reset-password?email=${encodeURIComponent(
          formData.email,
        )}&code=${code}`,
      );
    } catch (error: unknown) {
      console.log("Verify reset code error caught:", error);

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

      // Clear the code on error
      setResetCode(["", "", "", ""]);
      inputs.current[0]?.focus();
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, "");

    const newCode = [...resetCode];
    newCode[index] = numericValue.slice(0, 1); // Only take first character
    setResetCode(newCode);

    // Auto-focus next input
    if (numericValue && index < 3) {
      setTimeout(() => {
        inputs.current[index + 1]?.focus();
      }, 10);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (!resetCode[index] && index > 0) {
        // Move to previous input on backspace if current is empty
        inputs.current[index - 1]?.focus();
      } else if (resetCode[index]) {
        // Clear current input and stay there
        const newCode = [...resetCode];
        newCode[index] = "";
        setResetCode(newCode);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/[^0-9]/g, "");

    if (pasteData.length === 4) {
      const newCode = pasteData.split("").slice(0, 4);
      setResetCode(newCode);

      // Focus the last input
      setTimeout(() => {
        inputs.current[3]?.focus();
      }, 10);
    } else {
      setServerError("Please paste a 4-digit code");
    }
  };

  const handleResendCode = () => {
    router.push("/forgot-password");
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Enter Reset Code
        </CardTitle>
        <CardDescription className="text-center">
          Enter the 4-digit code sent to your email
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
            />
            <p className="text-xs text-gray-500">
              We sent a 4-digit reset code to this email address
            </p>
          </div>

          <div className="space-y-2">
            <Label>Reset Code</Label>
            <div className="flex space-x-2 justify-center">
              {[0, 1, 2, 3].map((index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    inputs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={resetCode[index]}
                  className="text-center font-mono text-lg h-12 w-12"
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  autoComplete="one-time-code"
                />
              ))}
            </div>
            {errors.resetCode && (
              <p className="text-sm text-red-600">{errors.resetCode.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Enter the 4-digit code from your email
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={
              isSubmitting ||
              verifyResetCodeMutation.isPending ||
              resetCode.join("").length !== 4
            }
          >
            {isSubmitting || verifyResetCodeMutation.isPending
              ? "Verifying..."
              : "Verify Code"}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              onClick={handleResendCode}
              className="text-blue-600 hover:underline"
            >
              Request a new code
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
