import type {
  AuthError,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ResendVerificationRequest,
  VerifyEmailRequest,
} from "@/features/auth/types/auth";
import { apiClient } from "@/lib/api/client";

export const authAPI = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    console.log("Register API call:", data);

    try {
      const response = await apiClient.post<AuthResponse>(
        "/api/auth/register",
        data,
      );
      console.log("Register API response:", response);
      return response;
    } catch (error) {
      console.log("Register API error:", error);
      throw error;
    }
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    console.log("Login API call:", data);

    try {
      const response = await apiClient.post<AuthResponse>(
        "/api/auth/login",
        data,
      );
      console.log("Login API response:", response);
      return response;
    } catch (error) {
      console.log("Login API error:", error);
      throw error;
    }
  },

  async verifyEmail(data: VerifyEmailRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        "/api/auth/verify-email",
        data,
      );
      return response;
    } catch (error) {
      console.log("Verify email API error:", error);
      throw error;
    }
  },

  async resendVerification(
    data: ResendVerificationRequest,
  ): Promise<{ message: string }> {
    try {
      return await apiClient.post<{ message: string }>(
        "/api/auth/resend-verification",
        data,
      );
    } catch (error) {
      console.error("Resend verification API error:", error);
      throw error;
    }
  },
};

export type { AuthError };
