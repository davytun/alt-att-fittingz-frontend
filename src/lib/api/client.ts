import { tokenManager } from "@/lib/token-manager";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://chosen-ophelia-daviwhizzy1-992ca0bc.koyeb.app/api/v1";

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "APIError";
  }
}

const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem("auth-storage");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.state?.token || null;
  } catch (err) {
    console.error("Failed to read token from storage", err);
    return null;
  }
};

export interface ApiClientOptions extends RequestInit {
  /** Skip token refresh on 401 (default: false) */
  skipAuthRefresh?: boolean;
}

export async function apiClient<T = unknown>(
  endpoint: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const {
    skipAuthRefresh = false,
    headers: customHeaders,
    ...restOptions
  } = options;

  const makeRequest = async (token: string | null): Promise<Response> => {
    const headers = new Headers(customHeaders || {});
    headers.set("Content-Type", "application/json");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...restOptions,
      headers,
      credentials: "include",
    });
  };

  let token = getStoredToken();
  let response = await makeRequest(token);

  const isAuthRoute =
    endpoint.includes("/auth/login") || endpoint.includes("/auth/register");

  if (response.status === 401 && !isAuthRoute && !skipAuthRefresh) {
    console.log("401 detected → attempting token refresh...");

    try {
      const refreshed = await tokenManager.refreshToken();

      if (refreshed) {
        token = getStoredToken(); // Get new token
        response = await makeRequest(token); // Retry original request
      } else {
        tokenManager.logout();
        throw new APIError(
          "Session expired. Please log in again.",
          401,
          "UNAUTHORIZED",
        );
      }
    } catch (err) {
      tokenManager.logout();
      throw new APIError("Authentication failed", 401, "AUTH_FAILED", err);
    }
  }

  if (!response.ok) {
    let errorBody: Record<string, unknown> = {};
    try {
      errorBody = await response.json();
    } catch {}

    const message =
      errorBody.message ||
      errorBody.details ||
      (Array.isArray(errorBody.errors)
        ? errorBody.errors
            .map((e: Record<string, unknown>) => e.message || String(e))
            .join(", ")
        : null) ||
      response.statusText ||
      "Request failed";

    throw new APIError(message, response.status, errorBody.code, errorBody);
  }

  try {
    return await response.json();
  } catch {
    return {} as T;
  }
}
