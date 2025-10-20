import type { CreateClientFormData } from "@/features/clients/schemas/client-schemas";
import type {
  Client,
  ClientError,
  ClientsResponse,
  DeleteClientResponse,
  UpdateClientRequest,
} from "@/features/clients/types/client";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/auth-store";

// Helper to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = useAuthStore.getState().token;

  if (token) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  return {};
};

export const clientAPI = {
  // Create a new client
  async createClient(data: CreateClientFormData): Promise<Client> {
    try {
      // Send only the basic fields that the server validates
      const serverData = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        eventType: data.eventType,
      };
      const headers = getAuthHeaders();
      const response = await apiClient.post<Client>(
        "/api/clients",
        serverData,
        {
          headers,
        },
      );
      return response;
    } catch (error: unknown) {
      console.error("Create client API error:", JSON.stringify(error, null, 2));
      if (error && typeof error === "object") {
        const err = error as {
          status?: number;
          message?: string;
          errors?: unknown;
          errorType?: string;
        };
        console.error("Status:", err.status);
        console.error("Message:", err.message);
        console.error("Errors:", JSON.stringify(err.errors, null, 2));
        console.error("ErrorType:", err.errorType);
      }
      throw error;
    }
  },

  // Get all clients with pagination
  async getClients(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<ClientsResponse> {
    try {
      const response = await apiClient.get<ClientsResponse>(
        `/api/clients?page=${page}&pageSize=${pageSize}`,
        {
          headers: getAuthHeaders(),
        },
      );
      return response;
    } catch (error: unknown) {
      console.error("Get clients API error:", error);

      if (typeof error === "string") {
        try {
          const parsedError = JSON.parse(error);
          throw parsedError;
        } catch {
          throw {
            message: error,
            status: 500,
          };
        }
      }

      throw error;
    }
  },

  // Get client by ID
  async getClientById(id: string): Promise<Client> {
    try {
      const response = await apiClient.get<Client>(`/api/clients/${id}`, {
        headers: getAuthHeaders(),
      });
      return response;
    } catch (error: unknown) {
      console.error("Get client by ID API error:", error);

      if (typeof error === "string") {
        try {
          const parsedError = JSON.parse(error);
          throw parsedError;
        } catch {
          throw {
            message: error,
            status: 500,
          };
        }
      }

      throw error;
    }
  },

  // Update client by ID
  async updateClient(id: string, data: UpdateClientRequest): Promise<Client> {
    try {
      const response = await apiClient.put<Client>(`/api/clients/${id}`, data, {
        headers: getAuthHeaders(),
      });
      return response;
    } catch (error: unknown) {
      console.error("Update client API error:", error);

      if (typeof error === "string") {
        try {
          const parsedError = JSON.parse(error);
          throw parsedError;
        } catch {
          throw {
            message: error,
            status: 500,
          };
        }
      }

      throw error;
    }
  },

  // Delete client by ID
  async deleteClient(id: string): Promise<DeleteClientResponse> {
    try {
      const response = await apiClient.delete<DeleteClientResponse>(
        `/api/clients/${id}`,
        {
          headers: getAuthHeaders(),
        },
      );
      return response;
    } catch (error: unknown) {
      console.error("Delete client API error:", error);

      if (typeof error === "string") {
        try {
          const parsedError = JSON.parse(error);
          throw parsedError;
        } catch {
          throw {
            message: error,
            status: 500,
          };
        }
      }

      throw error;
    }
  },
};

export type { ClientError };
