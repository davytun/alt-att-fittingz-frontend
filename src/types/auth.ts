import type { Admin, MessageResponse } from "@/lib/auth-schemas";

// Re-export types from schemas (single source of truth)
export type {
  Admin,
  AuthResponse,
  MessageResponse,
  UpdateProfileFormData,
  VerifyResetCodeResponse,
} from "@/lib/auth-schemas";

export interface RegisterRequest {
  email: string;
  password: string;
  businessName: string;
  contactPhone: string;
  businessAddress: string;
}

export interface UpdateProfileRequest {
  businessName?: string;
  contactPhone?: string;
  businessAddress?: string;
  profileImage?: File;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyEmailRequest {
  email: string;
  verificationCode: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface AuthState {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ApiError {
  message: string;
  errors?: Array<{
    msg: string;
    param: string;
    location: string;
    value: string;
  }>;
  errorType?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyResetCodeRequest {
  email: string;
  resetCode: string;
}

export interface ResetPasswordRequest {
  email: string;
  resetCode: string;
  newPassword: string;
}

// Re-export response types (aliases for backward compatibility)
export type ForgotPasswordResponse = MessageResponse;
export type ResetPasswordResponse = MessageResponse;

export type AuthError = ApiError & { status?: number };
