import type { Metadata } from "next";
import { VerifyResetCodeForm } from "@/components/verify-reset-code-form";

export const metadata: Metadata = {
  title: "Verify Reset Code - Admin Dashboard",
  description: "Verify your password reset code",
};

export default function VerifyResetCodePage() {
  return <VerifyResetCodeForm />;
}
