import { useAuthStore } from "@/lib/store/auth-store";
import type { ApiError } from "@/types/auth";
import type { AppError } from "./types";

export class ErrorHandler {
  handleAuthError(): void {
    const { clearAuth } = useAuthStore.getState();
    clearAuth();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  private isApiErrorLike(data: unknown): data is {
    message: string;
    errors?: ApiError["errors"];
    errorType?: string;
    stack?: unknown;
  } {
    if (!data || typeof data !== "object") return false;
    const d = data as Record<string, unknown>;
    if (typeof d.message !== "string") return false;
    const msg = d.message as string;
    return (
      msg.includes("already exists") || msg.includes("Error:") || "stack" in d
    );
  }

  async normalizeError(
    response: Response,
    responseData: unknown,
    options?: { disableAuthAutoLogout?: boolean },
  ): Promise<never> {
    // Handle non-200 status codes
    let errorData: ApiError = { message: "An unexpected error occurred" };

    if (typeof responseData === "string") {
      // Try to parse string as JSON
      try {
        const parsed = JSON.parse(responseData);
        if (parsed && typeof parsed === "object") {
          const p = parsed as Record<string, unknown>;
          errorData = {
            message:
              typeof p.message === "string"
                ? (p.message as string)
                : `HTTP Error ${response.status}`,
            errors: p.errors as ApiError["errors"],
            errorType:
              typeof p.errorType === "string"
                ? (p.errorType as string)
                : undefined,
          };
        } else {
          errorData.message = responseData;
        }
      } catch {
        errorData.message = responseData || `HTTP Error ${response.status}`;
      }
    } else if (typeof responseData === "object" && responseData !== null) {
      const obj = responseData as Record<string, unknown>;
      errorData = {
        message:
          typeof obj.message === "string"
            ? (obj.message as string)
            : `HTTP Error ${response.status}`,
        errors: obj.errors as ApiError["errors"],
        errorType:
          typeof obj.errorType === "string"
            ? (obj.errorType as string)
            : undefined,
      };
    }

    const error: AppError = {
      status: response.status,
      message: errorData.message || "An unexpected error occurred",
      errors: errorData.errors,
      errorType: errorData.errorType,
    };

    // Handle 401 errors globally (unless explicitly disabled)
    if (response.status === 401 && !options?.disableAuthAutoLogout) {
      this.handleAuthError();
    }

    throw error;
  }

  async handleResponse<T>(
    response: Response,
    options?: { disableAuthAutoLogout?: boolean },
  ): Promise<T> {
    const contentType = response.headers.get("content-type");
    let responseData: unknown;

    // Parse response based on content type
    if (contentType?.includes("application/json")) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      // Try to parse as JSON if it looks like JSON
      if (text.trim().startsWith("{") || text.trim().startsWith("[")) {
        try {
          responseData = JSON.parse(text);
        } catch {
          responseData = text;
        }
      } else {
        responseData = text;
      }
    }

    // Debug logging for non-ok responses
    if (!response.ok) {
      console.log("API Response Error - Status:", response.status);
      console.log("API Response Error - StatusText:", response.statusText);
      console.log("API Response Error - ContentType:", contentType);
      console.log("API Response Error - ResponseData:", responseData);
    }

    // Handle cases where API returns 2xx
    if (response.ok) {
      // If backend uses a success flag, honor it
      if (
        responseData &&
        typeof responseData === "object" &&
        "success" in (responseData as Record<string, unknown>) &&
        (responseData as Record<string, unknown>).success === false
      ) {
        const rd = responseData as Record<string, unknown>;
        const err: AppError = {
          status: 400,
          message:
            typeof rd.message === "string"
              ? (rd.message as string)
              : "Request failed",
          errors: (rd.errors as ApiError["errors"]) || undefined,
          errorType:
            typeof rd.errorType === "string"
              ? (rd.errorType as string)
              : undefined,
        };
        throw err;
      }

      // Backward-compatible heuristic (kept but secondary to success flag)
      if (this.isApiErrorLike(responseData)) {
        const rd = responseData as Record<string, unknown>;
        const err: AppError = {
          status: 400,
          message: (rd.message as string) || "Request failed",
          errors: (rd.errors as ApiError["errors"]) || undefined,
          errorType:
            typeof rd.errorType === "string"
              ? (rd.errorType as string)
              : undefined,
        };
        throw err;
      }

      return responseData as T;
    }

    // Handle non-200 status codes
    return this.normalizeError(response, responseData, options);
  }
}
