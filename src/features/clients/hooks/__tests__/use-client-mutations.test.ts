import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { useToast } from "@/components/ui/toast";
import { clientAPI } from "@/features/clients/services/client-api";
import {
  useCreateClientMutation,
  useDeleteClientMutation,
  useUpdateClientMutation,
} from "../use-client-mutations";

// Mock dependencies
jest.mock("@/features/clients/services/client-api");
jest.mock("@/components/ui/toast");
jest.mock("@/lib/store/auth-store", () => ({
  useAuthStore: {
    getState: jest.fn(() => ({ token: "mock-token" })),
  },
}));

const mockClientAPI = clientAPI as jest.Mocked<typeof clientAPI>;
const mockUseToast = jest.mocked(useToast);

// Test wrapper component
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe("Client Mutation Hooks", () => {
  const mockShowToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseToast.mockReturnValue({
      toasts: [],
      showToast: mockShowToast,
      dismissToast: jest.fn(),
    });
  });

  const mockClient = {
    id: "client-123",
    name: "John Doe",
    phone: "1234567890",
    email: "john@example.com",
    eventType: "Wedding",
    favoriteColors: ["Blue"],
    dislikedColors: [],
    preferredStyles: ["Formal"],
    bodyShape: "Pear",
    additionalDetails: "Test",
    adminId: "admin-123",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    measurements: [],
    styleImages: [],
    _count: {
      measurements: 0,
      styleImages: 0,
    },
  };

  describe("useCreateClientMutation", () => {
    it("should create client and show success toast", async () => {
      mockClientAPI.createClient.mockResolvedValue(mockClient);

      const { result } = renderHook(() => useCreateClientMutation(), {
        wrapper: createWrapper(),
      });

      const createData = {
        name: "John Doe",
        phone: "1234567890",
        email: "john@example.com",
        eventType: "Wedding",
        favoriteColors: ["Blue"],
        dislikedColors: [],
        preferredStyles: ["Formal"],
        bodyShape: "Pear",
        additionalDetails: "Test",
      };

      result.current.mutate(createData);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockClientAPI.createClient).toHaveBeenCalledWith(
        createData,
        expect.any(Object),
      );
      expect(mockShowToast).toHaveBeenCalledWith({
        title: "Client Created",
        description: "John Doe has been added successfully.",
        type: "success",
      });
    });

    it("should handle create client error", async () => {
      const error = { message: "Creation failed" };
      mockClientAPI.createClient.mockRejectedValue(error);

      const { result } = renderHook(() => useCreateClientMutation(), {
        wrapper: createWrapper(),
      });

      const invalidData = {} as Parameters<typeof result.current.mutate>[0];
      result.current.mutate(invalidData);

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(mockShowToast).toHaveBeenCalledWith({
        title: "Creation Failed",
        description: "Creation failed",
        type: "error",
      });
    });
  });

  describe("useUpdateClientMutation", () => {
    it("should update client and show success toast", async () => {
      const updatedClient = { ...mockClient, name: "John Updated" };
      mockClientAPI.updateClient.mockResolvedValue(updatedClient);

      const { result } = renderHook(() => useUpdateClientMutation(), {
        wrapper: createWrapper(),
      });

      const updateData = { name: "John Updated" };
      result.current.mutate({ id: "client-123", data: updateData });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockClientAPI.updateClient).toHaveBeenCalledWith(
        "client-123",
        updateData,
      );
      expect(mockShowToast).toHaveBeenCalledWith({
        title: "Client Updated",
        description: "John Updated has been updated successfully.",
        type: "success",
      });
    });
  });

  describe("useDeleteClientMutation", () => {
    it("should delete client and show success toast", async () => {
      const deleteResponse = { message: "Client deleted successfully" };
      mockClientAPI.deleteClient.mockResolvedValue(deleteResponse);

      const { result } = renderHook(() => useDeleteClientMutation(), {
        wrapper: createWrapper(),
      });

      result.current.mutate("client-123");

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockClientAPI.deleteClient).toHaveBeenCalledWith(
        "client-123",
        expect.any(Object),
      );
      expect(mockShowToast).toHaveBeenCalledWith({
        title: "Client Deleted",
        description: "Client deleted successfully",
        type: "success",
      });
    });

    it("should handle delete client error", async () => {
      const error = { message: "Deletion failed" };
      mockClientAPI.deleteClient.mockRejectedValue(error);

      const { result } = renderHook(() => useDeleteClientMutation(), {
        wrapper: createWrapper(),
      });

      result.current.mutate("client-123");

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(mockShowToast).toHaveBeenCalledWith({
        title: "Deletion Failed",
        description: "Deletion failed",
        type: "error",
      });
    });
  });
});
