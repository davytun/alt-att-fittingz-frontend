import type { ApiError } from "@/features/auth/types/auth";

class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor() {
    this.baseURL =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://chosen-ophelia-daviwhizzy1-992ca0bc.koyeb.app";
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
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

    // Handle cases where API returns 200 but with error message
    if (response.ok) {
      // Check if the response is actually an error disguised as success
      if (
        typeof responseData === "object" &&
        responseData.message &&
        (responseData.message.includes("already exists") ||
          responseData.message.includes("Error:") ||
          responseData.stack)
      ) {
        // This is actually an error response with 200 status
        throw {
          status: 400, // Treat as client error
          message: responseData.message,
          errors: responseData.errors,
          errorType: responseData.errorType,
        };
      }

      return responseData;
    }

    // Handle non-200 status codes
    // If responseData is a string that contains JSON, parse it
    let errorData: ApiError = { message: "An unexpected error occurred" };

    if (typeof responseData === "string") {
      // Try to parse string as JSON
      try {
        const parsed = JSON.parse(responseData);
        if (parsed && typeof parsed === "object") {
          errorData = parsed;
        } else {
          errorData.message = responseData;
        }
      } catch {
        errorData.message = responseData || `HTTP Error ${response.status}`;
      }
    } else if (typeof responseData === "object") {
      errorData = responseData;
    }

    throw {
      status: response.status,
      message: errorData.message || "An unexpected error occurred",
      errors: errorData.errors,
      errorType: errorData.errorType,
    };
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit,
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "POST",
        headers: this.defaultHeaders,
        body: data ? JSON.stringify(data) : undefined,
        ...options,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      // If error is a string that contains JSON, parse it
      if (typeof error === "string") {
        try {
          const parsedError = JSON.parse(error);
          throw parsedError;
        } catch {
          // If parsing fails, throw as regular error
          throw {
            message: error,
            status: 500,
          };
        }
      }

      // Ensure all errors have at least a message
      if (error && typeof error === "object" && !("message" in error)) {
        (error as { message: string }).message = "Network error occurred";
      }
      throw error;
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "GET",
        headers: this.defaultHeaders,
        ...options,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error && typeof error === "object" && !("message" in error)) {
        (error as { message: string }).message = "Network error occurred";
      }
      throw error;
    }
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit,
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "PUT",
        headers: this.defaultHeaders,
        body: data ? JSON.stringify(data) : undefined,
        ...options,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error && typeof error === "object" && !("message" in error)) {
        (error as { message: string }).message = "Network error occurred";
      }
      throw error;
    }
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "DELETE",
        headers: this.defaultHeaders,
        ...options,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error && typeof error === "object" && !("message" in error)) {
        (error as { message: string }).message = "Network error occurred";
      }
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
