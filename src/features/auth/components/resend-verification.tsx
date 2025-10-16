"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ResendVerificationProps {
  email: string;
}

export function ResendVerification({ email: _email }: ResendVerificationProps) {
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState("");

  const handleResend = async () => {
    setIsResending(true);
    setMessage("");

    try {
      // TODO: Implement resend verification API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      setMessage("Verification code sent successfully!");
    } catch (_error) {
      setMessage("Failed to resend verification code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="text-center space-y-3 py-3">
      <p className="text-sm text-gray-600">Didn't receive the code?</p>
      <Button
        variant="outline"
        onClick={handleResend}
        disabled={isResending}
        className="w-full font-bold text-[#0F4C75]"
      >
        {isResending ? "Sending..." : "Resend Verification Code"}
      </Button>
      {message && (
        <p
          className={`text-sm ${
            message.includes("successfully") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
