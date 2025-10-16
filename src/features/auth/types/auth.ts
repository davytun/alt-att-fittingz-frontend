export interface Admin {
  id: number;
  email: string;
  businessName: string;
  contactPhone?: string;
  businessAddress?: string;
  isEmailVerified?: boolean;
}

export interface AuthResponse {
  message: string;
  token: string;
  admin: Admin;
}

export interface RegisterRequest {
  email: string;
  password: string;
  businessName: string;
  contactPhone: string;
  businessAddress: string;
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

export interface ForgotPasswordResponse {
  message: string;
}

export interface VerifyResetCodeResponse {
  message: string;
  verified: boolean;
}

export interface ResetPasswordResponse {
  message: string;
}

export type AuthError = ApiError & { status?: number };
