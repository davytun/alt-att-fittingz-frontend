import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { type AuthResponse, apiClient, endpoints } from "@/api";
import { useAuth } from "@/hooks/use-auth";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  businessName: string;
  contactPhone: string;
  businessAddress: string;
}

interface VerifyEmailData {
  email: string;
  verificationCode: string;
}

interface ForgotPasswordData {
  email: string;
}

interface ResetPasswordData {
  email: string;
  resetCode: string;
  newPassword: string;
}

interface VerifyResetCodeData {
  email: string;
  resetCode: string;
}

export function useLogin() {
  const router = useRouter();
  const { setAuth } = useAuth();

  return useMutation({
    mutationFn: (data: LoginData) =>
      apiClient<AuthResponse>(endpoints.auth.login, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      if (data?.admin && data?.token) {
        setAuth(data.admin, data.token);
        toast.success("Login Successful", {
          description: "Welcome back!",
        });
        router.push("/dashboard");
      }
    },
    onError: () => {
      toast.error("Login Failed", {
        description:
          "Incorrect email or password. Try again or reset your password.",
      });
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterData) =>
      apiClient<AuthResponse>(endpoints.auth.register, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (data, variables) => {
      const email = data?.admin?.email ?? variables?.email;
      toast.success("Registration Successful", {
        description: "Please check your email to verify your account.",
      });
      if (email) {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      } else {
        router.push("/verify-email");
      }
    },
    onError: () => {
      toast.error("Registration Failed", {
        description: "Please check your details and try again.",
      });
    },
  });
}

export function useVerifyEmail() {
  const router = useRouter();
  const { setAuth } = useAuth();

  return useMutation({
    mutationFn: (data: VerifyEmailData) =>
      apiClient<AuthResponse>(endpoints.auth.verifyEmail, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      if (data?.admin && data?.token) {
        setAuth(data.admin, data.token);
        toast.success("Email Verified", {
          description: "Your email has been successfully verified!",
        });
        router.push("/dashboard");
      }
    },
    onError: () => {
      toast.error("Verification Failed", {
        description: "Invalid verification code.",
      });
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordData) =>
      apiClient<{ message: string }>(endpoints.auth.forgotPassword, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      toast.success("Reset Code Sent", {
        description: data.message || "Password reset code has been sent to your email.",
      });
    },
    onError: () => {
      toast.error("Failed to Send", {
        description: "Failed to send reset code. Please try again.",
      });
    },
  });
}

export function useVerifyResetCode() {
  return useMutation({
    mutationFn: (data: VerifyResetCodeData) =>
      apiClient<{ message: string }>(endpoints.auth.verifyResetCode, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      toast.success("Code Verified", {
        description: data.message || "Reset code verified successfully.",
      });
    },
    onError: () => {
      toast.error("Verification Failed", {
        description: "Invalid reset code. Please try again.",
      });
    },
  });
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ResetPasswordData) =>
      apiClient<{ message: string }>(endpoints.auth.resetPassword, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      toast.success("Password Reset", {
        description: data.message || "Password reset successful. You can now log in with your new password.",
      });
      router.push("/login");
    },
    onError: () => {
      toast.error("Reset Failed", {
        description: "Failed to reset password. Please try again.",
      });
    },
  });
}

export { useAuth };
