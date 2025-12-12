import { API_CONFIG } from "@/lib/config";
import { useAuthStore } from "@/lib/store/auth-store";
import { tokenManager } from "@/lib/token-manager";

async function makeAuthenticatedRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const makeRequest = async (): Promise<Response> => {
    const { token } = useAuthStore.getState();

    return fetch(`${API_CONFIG.API_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });
  };

  let response = await makeRequest();

  // Handle 401 with automatic token refresh
  if (response.status === 401) {
    response = await tokenManager.handleApiError(response, makeRequest);
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Request failed");
  }

  return response.json();
}

export const AuthenticatedClient = {
  async get<T>(endpoint: string): Promise<T> {
    return makeAuthenticatedRequest<T>(endpoint, {
      method: "GET",
    });
  },

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return makeAuthenticatedRequest<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return makeAuthenticatedRequest<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return makeAuthenticatedRequest<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  async delete<T>(endpoint: string): Promise<T> {
    return makeAuthenticatedRequest<T>(endpoint, {
      method: "DELETE",
    });
  },
};
