import { useAuthStore } from "@/lib/store/auth-store";
import type { Admin } from "../types/auth";

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("useAuthStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.getState().clearAuth();
  });

  it("should initialize with default state", () => {
    const state = useAuthStore.getState();

    expect(state.admin).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
  });

  it("should set auth correctly", () => {
    const mockAdmin: Admin = {
      id: 1,
      email: "test@example.com",
      businessName: "Test Business",
      isEmailVerified: true,
    };
    const mockToken = "mock-token";

    useAuthStore.getState().setAuth(mockAdmin, mockToken);
    const state = useAuthStore.getState();

    expect(state.admin).toEqual(mockAdmin);
    expect(state.token).toBe(mockToken);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it("should clear auth correctly", () => {
    const mockAdmin: Admin = {
      id: 1,
      email: "test@example.com",
      businessName: "Test Business",
    };

    // First set auth
    useAuthStore.getState().setAuth(mockAdmin, "token");

    // Then clear it
    useAuthStore.getState().clearAuth();
    const state = useAuthStore.getState();

    expect(state.admin).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
  });

  it("should update loading state", () => {
    useAuthStore.getState().setLoading(false);
    expect(useAuthStore.getState().isLoading).toBe(false);

    useAuthStore.getState().setLoading(true);
    expect(useAuthStore.getState().isLoading).toBe(true);
  });

  it("should update admin partially", () => {
    const mockAdmin: Admin = {
      id: 1,
      email: "test@example.com",
      businessName: "Test Business",
      isEmailVerified: false,
    };

    useAuthStore.getState().setAuth(mockAdmin, "token");

    useAuthStore.getState().updateAdmin({ isEmailVerified: true });
    const state = useAuthStore.getState();

    expect(state.admin?.isEmailVerified).toBe(true);
    expect(state.admin?.email).toBe("test@example.com");
  });

  it("should handle updateAdmin when admin is null", () => {
    useAuthStore.getState().clearAuth();
    useAuthStore.getState().updateAdmin({ isEmailVerified: true });

    expect(useAuthStore.getState().admin).toBeNull();
  });
});
