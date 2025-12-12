import { useAuthStore } from "@/lib/store/auth-store";
import { APIError } from "./client";
import type { ErrorHandler } from "./error-handler";

export class AuthHandler {
  private refreshInFlight: Promise<void> | null = null;
  private baseURL: string;
  private defaultHeaders: HeadersInit;
  private enableRefresh: boolean;
  private errorHandler: ErrorHandler;

  constructor(
    baseURL: string,
    defaultHeaders: HeadersInit,
    enableRefresh: boolean,
    errorHandler: ErrorHandler,
  ) {
    this.baseURL = baseURL;
    this.defaultHeaders = defaultHeaders;
    this.enableRefresh = enableRefresh;
    this.errorHandler = errorHandler;
  }

  async refreshToken(): Promise<void> {
    if (!this.enableRefresh) {
      throw new APIError("Refresh disabled", 401);
    }

    if (this.refreshInFlight) {
      // Deduplicate concurrent refreshes
      return this.refreshInFlight;
    }

    this.refreshInFlight = (async () => {
      try {
        const response = await fetch(`${this.baseURL}/auth/refresh`, {
          method: "POST",
          headers: this.defaultHeaders,
          credentials: "include", // support cookie-based refresh
        });

        type RefreshResponse = {
          message?: string;
          token?: string;
          admin?: { [k: string]: unknown };
          success?: boolean;
        };

        const data = await this.errorHandler.handleResponse<RefreshResponse>(
          response,
          {
            disableAuthAutoLogout: true, // don't auto-logout if refresh fails
          },
        );

        const { setAuth, admin: currentAdmin } = useAuthStore.getState();
        if (data?.token) {
          // Prefer admin from response; fallback to existing admin
          const adminToUse =
            (data as { admin?: unknown }).admin || currentAdmin;
          setAuth(adminToUse as any, data.token);
        } else {
          throw new APIError("No token returned from refresh", 401);
        }
      } finally {
        this.refreshInFlight = null;
      }
    })();

    return this.refreshInFlight;
  }

  getAuthHeaders(): HeadersInit {
    const token = useAuthStore.getState().token;
    if (token) {
      return {
        Authorization: `Bearer ${token}`,
      };
    }
    return {};
  }

  withUpdatedAuthHeader(init?: RequestInit): RequestInit | undefined {
    if (!init || !init.headers) return init;
    const headers = new Headers(init.headers as HeadersInit);
    const token = useAuthStore.getState().token;
    if (headers.has("Authorization") && token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return { ...init, headers };
  }
}
