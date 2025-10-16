"use client";

import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResendVerification } from "@/features/auth/components/resend-verification";
import { VerifyEmailForm } from "@/features/auth/components/verify-email-form";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="w-full max-w-md mx-auto !shadow-none">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            OTP Verification
          </CardTitle>
          <CardDescription className="text-center">
            Enter the 6-digit verification code sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VerifyEmailForm email={email || ""} />
        </CardContent>
      </Card>

      {email && (
        <div className="px-2 w-full max-w-md mx-auto">
          <ResendVerification email={email} />
        </div>
      )}
    </div>
  );
}
