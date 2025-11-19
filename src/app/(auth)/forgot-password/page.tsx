import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password - Admin Dashboard",
  description: "Reset your admin account password",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
