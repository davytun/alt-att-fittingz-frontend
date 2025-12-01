import { tokenManager } from "@/lib/token-manager";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://chosen-ophelia-daviwhizzy1-992ca0bc.koyeb.app/api/v1";

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
    this.name = "APIError";
  }
}

async function getAuthToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  
  try {
    // Get from Zustand persist storage
    const stored = localStorage.getItem("auth-storage");
    if (stored) {
      const parsed = JSON.parse(stored);
      const token = parsed.state?.token;
      console.log("Token from storage:", token ? "Found" : "Not found");
      return token || null;
    }
  } catch (error) {
    console.error("Error getting token:", error);
  }
  
  return null;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const makeRequest = async (): Promise<Response> => {
    const token = await getAuthToken();
    
    const config: RequestInit = {
      ...options,
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    return fetch(`${baseURL}${endpoint}`, config);
  };

  let response = await makeRequest();
  
  // Handle 401 with token refresh (but not for auth endpoints)
  const isAuthEndpoint = endpoint.includes('/auth/login') || endpoint.includes('/auth/register');
  if (response.status === 401 && !isAuthEndpoint) {
    response = await tokenManager.handleApiError(response, makeRequest);
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    // For validation errors, include detailed error information
    let errorMessage = error.message || "Request failed";
    if (error.errors && Array.isArray(error.errors)) {
      errorMessage = error.errors.map((e: any) => e.message || e).join(', ');
    } else if (error.details) {
      errorMessage = error.details;
    }
    throw new APIError(
      errorMessage,
      response.status,
      error.code,
    );
  }

  return response.json();
}
