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
    <div className="space-y-6">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Verify Your Email
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
        <div className="w-full max-w-md mx-auto">
          <ResendVerification email={email} />
        </div>
      )}
    </div>
  );
}
