import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { clientAPI } from "@/features/clients/services/client-api";
import { useClient, useClients } from "../use-client-queries";

// Mock the API
jest.mock("@/features/clients/services/client-api");
jest.mock("@/lib/store/auth-store", () => ({
  useAuthStore: {
    getState: jest.fn(() => ({ token: "mock-token" })),
  },
}));

const mockClientAPI = clientAPI as jest.Mocked<typeof clientAPI>;

// Test wrapper
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe("Client Query Hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockClientsResponse = {
    data: [
      {
        id: "1",
        name: "John Doe",
        phone: "1234567890",
        email: "john@example.com",
        eventType: "Wedding",
        favoriteColors: [],
        dislikedColors: [],
        preferredStyles: [],
        bodyShape: "",
        additionalDetails: "",
        adminId: "admin1",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        measurements: [],
        styleImages: [],
        _count: { measurements: 0, styleImages: 0 },
      },
    ],
    pagination: {
      page: 1,
      pageSize: 10,
      total: 1,
      totalPages: 1,
    },
  };

  describe("useClients", () => {
    it("should fetch clients with pagination", async () => {
      mockClientAPI.getClients.mockResolvedValue(mockClientsResponse);

      const { result } = renderHook(() => useClients(1, 10), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockClientAPI.getClients).toHaveBeenCalledWith(1, 10);
      expect(result.current.data).toEqual(mockClientsResponse);
    });

    it("should use default pagination values", async () => {
      mockClientAPI.getClients.mockResolvedValue(mockClientsResponse);

      renderHook(() => useClients(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(mockClientAPI.getClients).toHaveBeenCalledWith(1, 10);
      });
    });

    it("should handle errors", async () => {
      const error = { message: "Failed to fetch", status: 400 };
      mockClientAPI.getClients.mockRejectedValue(error);

      const { result } = renderHook(() => useClients(1, 10), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true), {
        timeout: 3000,
      });
      expect(result.current.error).toEqual(error);
    });
  });

  describe("useClient", () => {
    const mockClient = mockClientsResponse.data[0];

    it("should fetch client by ID", async () => {
      mockClientAPI.getClientById.mockResolvedValue(mockClient);

      const { result } = renderHook(() => useClient("1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockClientAPI.getClientById).toHaveBeenCalledWith("1");
      expect(result.current.data).toEqual(mockClient);
    });

    it("should not fetch when ID is not provided", async () => {
      const { result } = renderHook(() => useClient(""), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(false);
      expect(mockClientAPI.getClientById).not.toHaveBeenCalled();
    });

    it("should handle client not found", async () => {
      const error = { message: "Client not found", status: 404 };
      mockClientAPI.getClientById.mockRejectedValue(error);

      const { result } = renderHook(() => useClient("non-existent"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toEqual(error);
    });
  });
});
