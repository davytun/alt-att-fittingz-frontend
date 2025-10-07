import type { Metadata } from "next";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = {
  title: "Register - Admin Dashboard",
  description: "Create a new admin account",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
