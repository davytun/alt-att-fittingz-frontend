import { z } from "zod";

export const registerSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*()_+-=[\]{};':"\\|,.<>/?]/,
      "Password must contain at least one special character",
    ),
  businessName: z.string().min(1, "Business name is required"),
  contactPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  businessAddress: z.string().min(1, "Business address is required"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const verifyEmailSchema = z.object({
  email: z.email("Invalid email address"),
  verificationCode: z
    .string()
    .length(6, "Verification code must be 6 digits")
    .regex(/^\d+$/, "Verification code must contain only numbers"),
});

export const resendVerificationSchema = z.object({
  email: z.email("Invalid email address"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationFormData = z.infer<
  typeof resendVerificationSchema
>;
