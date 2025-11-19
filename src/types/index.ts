export type {
  Admin,
  AuthResponse,
  MessageResponse,
  VerifyResetCodeResponse,
  RegisterRequest,
  LoginRequest,
  VerifyEmailRequest,
  ResendVerificationRequest,
  AuthState,
  ForgotPasswordRequest,
  VerifyResetCodeRequest,
  ResetPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  AuthError,
} from "./auth";

export type {
  Client,
  ClientResponse,
  ClientsResponse,
  CreateClientFormData,
  DeleteClientResponse,
  Measurement,
  StyleImage,
  UpdateClientFormData,
  ClientError,
} from "./client";

// Export ApiError from auth only to avoid conflicts
export type { ApiError } from "./auth";
