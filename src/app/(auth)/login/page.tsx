import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Sign In - Admin Dashboard",
  description: "Sign in to your admin dashboard",
};

export default function LoginPage() {
  return <LoginForm />;
}
