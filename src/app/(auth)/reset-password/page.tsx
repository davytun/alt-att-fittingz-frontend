import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password - Admin Dashboard",
  description: "Set your new password",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
