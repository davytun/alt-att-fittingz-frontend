import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { authAPI } from "@/features/auth/services/auth-api";
import type { AuthError } from "@/features/auth/types/auth";
import { useAuth } from "./use-auth";

export const useRegisterMutation = () => {
  const router = useRouter();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: authAPI.register,
    onSuccess: (data, variables) => {
      const email = data?.admin?.email ?? variables?.email;

      showToast({
        title: "Registration Successful",
        description:
          data?.message || "Please check your email to verify your account.",
        type: "success",
      });

      if (email) {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      } else {
        // Fallback navigation without query if email is unavailable
        router.push("/verify-email");
      }
    },
    onError: (error: AuthError) => {
      console.warn("Registration error details:", error);

      const errorMessage =
        error?.message ||
        "Registration failed. Please check your details and try again.";
      const title =
        error?.status === 429 ? "Too Many Attempts" : "Registration Failed";

      showToast({
        title,
        description: errorMessage,
        type: "error",
      });
    },
  });
};

export const useLoginMutation = () => {
  const router = useRouter();
  const { setAuth } = useAuth();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      if (data?.admin && data?.token) {
        setAuth(data.admin, data.token);
        showToast({
          title: "Login Successful",
          description: "Welcome back!",
          type: "success",
        });
        router.push("/dashboard");
      } else {
        throw new Error("Invalid response from server");
      }
    },
    onError: (error: AuthError) => {
      console.error("Login error details:", error);

      const errorMessage = error?.message || "Invalid email or password";
      showToast({
        title: "Login Failed",
        description: errorMessage,
        type: "error",
      });
    },
  });
};

export const useVerifyEmailMutation = () => {
  const router = useRouter();
  const { setAuth } = useAuth();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: authAPI.verifyEmail,
    onSuccess: (data) => {
      if (data?.admin && data?.token) {
        setAuth(data.admin, data.token);
        showToast({
          title: "Email Verified",
          description: "Your email has been successfully verified!",
          type: "success",
        });
        router.push("/dashboard");
      } else {
        throw new Error("Invalid verification response");
      }
    },
    onError: (error: AuthError) => {
      console.error("Verification error details:", error);

      const errorMessage = error?.message || "Invalid verification code";
      showToast({
        title: "Verification Failed",
        description: errorMessage,
        type: "error",
      });
    },
  });
};

export const useResendVerificationMutation = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: authAPI.resendVerification,
    onSuccess: (data) => {
      showToast({
        title: "Verification Email Sent",
        description:
          data.message ||
          "A new verification code has been sent to your email.",
        type: "success",
      });
    },
    onError: (error: AuthError) => {
      console.error("Resend verification error details:", error);

      const errorMessage =
        error?.message || "Unable to resend verification email";
      showToast({
        title: "Failed to Resend",
        description: errorMessage,
        type: "error",
      });
    },
  });
};
