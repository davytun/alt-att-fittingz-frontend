import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/auth-store";
import { clientAPI } from "../client-api";

// Mock the dependencies
jest.mock("@/lib/api/client");
jest.mock("@/lib/store/auth-store");

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;
const mockUseAuthStore = useAuthStore as jest.Mocked<typeof useAuthStore>;

describe("Client API Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock auth store to return a token
    mockUseAuthStore.getState.mockReturnValue({
      token: "mock-jwt-token",
      admin: null,
      isAuthenticated: true,
      isLoading: false,
      setAuth: jest.fn(),
      clearAuth: jest.fn(),
      setLoading: jest.fn(),
      updateAdmin: jest.fn(),
      hydrate: jest.fn(),
    });
  });

  const mockClient = {
    id: "client-123",
    name: "John Doe",
    phone: "1234567890",
    email: "john@example.com",
    eventType: "Wedding",
    favoriteColors: ["Blue", "Red"],
    dislikedColors: ["Green"],
    preferredStyles: ["Casual", "Formal"],
    bodyShape: "Pear",
    additionalDetails: "Prefers lightweight fabrics",
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

  describe("createClient", () => {
    it("should create a client successfully", async () => {
      const createData = {
        name: "John Doe",
        phone: "1234567890",
        email: "john@example.com",
        eventType: "Wedding",
        favoriteColors: ["Blue", "Red"],
        dislikedColors: ["Green"],
        preferredStyles: ["Casual", "Formal"],
        bodyShape: "Pear",
        additionalDetails: "Prefers lightweight fabrics",
      };

      mockApiClient.post.mockResolvedValue(mockClient);

      const result = await clientAPI.createClient(createData);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        "/api/clients",
        createData,
        {
          headers: {
            Authorization: "Bearer mock-jwt-token",
          },
        },
      );
      expect(result).toEqual(mockClient);
    });

    it("should handle create client errors", async () => {
      const createData = {
        name: "John Doe",
        phone: "1234567890",
        email: "john@example.com",
        eventType: "Wedding",
        favoriteColors: [],
        dislikedColors: [],
        preferredStyles: [],
        bodyShape: "",
        additionalDetails: "",
      };

      const error = { message: "Validation failed", status: 400 };
      mockApiClient.post.mockRejectedValue(error);

      await expect(clientAPI.createClient(createData)).rejects.toEqual(error);
    });
  });

  describe("getClients", () => {
    it("should get clients with pagination", async () => {
      const mockResponse = {
        data: [mockClient],
        pagination: {
          page: 1,
          pageSize: 10,
          total: 1,
          totalPages: 1,
        },
      };

      mockApiClient.get.mockResolvedValue(mockResponse);

      const result = await clientAPI.getClients(1, 10);

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/api/clients?page=1&pageSize=10",
        {
          headers: {
            Authorization: "Bearer mock-jwt-token",
          },
        },
      );
      expect(result).toEqual(mockResponse);
    });

    it("should use default pagination values", async () => {
      const mockResponse = {
        data: [mockClient],
        pagination: {
          page: 1,
          pageSize: 10,
          total: 1,
          totalPages: 1,
        },
      };

      mockApiClient.get.mockResolvedValue(mockResponse);

      await clientAPI.getClients();

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/api/clients?page=1&pageSize=10",
        {
          headers: {
            Authorization: "Bearer mock-jwt-token",
          },
        },
      );
    });
  });

  describe("getClientById", () => {
    it("should get a client by ID", async () => {
      mockApiClient.get.mockResolvedValue(mockClient);

      const result = await clientAPI.getClientById("client-123");

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/api/clients/client-123",
        {
          headers: {
            Authorization: "Bearer mock-jwt-token",
          },
        },
      );
      expect(result).toEqual(mockClient);
    });

    it("should handle client not found", async () => {
      const error = { message: "Client not found", status: 404 };
      mockApiClient.get.mockRejectedValue(error);

      await expect(clientAPI.getClientById("non-existent")).rejects.toEqual(
        error,
      );
    });
  });

  describe("updateClient", () => {
    it("should update a client successfully", async () => {
      const updateData = {
        name: "John Updated",
        phone: "0987654321",
      };

      const updatedClient = { ...mockClient, ...updateData };
      mockApiClient.put.mockResolvedValue(updatedClient);

      const result = await clientAPI.updateClient("client-123", updateData);

      expect(mockApiClient.put).toHaveBeenCalledWith(
        "/api/clients/client-123",
        updateData,
        {
          headers: {
            Authorization: "Bearer mock-jwt-token",
          },
        },
      );
      expect(result).toEqual(updatedClient);
    });
  });

  describe("deleteClient", () => {
    it("should delete a client successfully", async () => {
      const deleteResponse = { message: "Client deleted successfully" };
      mockApiClient.delete.mockResolvedValue(deleteResponse);

      const result = await clientAPI.deleteClient("client-123");

      expect(mockApiClient.delete).toHaveBeenCalledWith(
        "/api/clients/client-123",
        {
          headers: {
            Authorization: "Bearer mock-jwt-token",
          },
        },
      );
      expect(result).toEqual(deleteResponse);
    });
  });

  describe("authentication handling", () => {
    it("should make requests without auth headers when no token", async () => {
      mockUseAuthStore.getState.mockReturnValue({
        token: null,
        admin: null,
        isAuthenticated: false,
        isLoading: false,
        setAuth: jest.fn(),
        clearAuth: jest.fn(),
        setLoading: jest.fn(),
        updateAdmin: jest.fn(),
        hydrate: jest.fn(),
      });

      mockApiClient.get.mockResolvedValue({
        data: [],
        pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 },
      });

      await clientAPI.getClients();

      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/api/clients?page=1&pageSize=10",
        {
          headers: {},
        },
      );
    });
  });
});
