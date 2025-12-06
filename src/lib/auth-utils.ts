import { API_CONFIG } from "@/lib/config";
import { useAuthStore } from "@/lib/store/auth-store";

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  admin: {
    id: string;
    email: string;
    businessName: string;
    contactPhone?: string;
    businessAddress?: string;
    isVerified?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
}

export const authUtils = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_CONFIG.API_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Login failed");
    }

    const data: LoginResponse = await response.json();

    // Store auth data with complete Admin object
    const { setAuth } = useAuthStore.getState();
    const completeAdmin = {
      id: data.admin.id,
      email: data.admin.email,
      businessName: data.admin.businessName,
      contactPhone: data.admin.contactPhone || "",
      businessAddress: data.admin.businessAddress || "",
      isVerified: data.admin.isVerified || false,
      createdAt: data.admin.createdAt || new Date().toISOString(),
      updatedAt: data.admin.updatedAt || new Date().toISOString(),
    };
    setAuth(completeAdmin, data.token);

    return data;
  },

  async register(
    email: string,
    password: string,
    businessName: string,
  ): Promise<LoginResponse> {
    const response = await fetch(`${API_CONFIG.API_URL}/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, businessName }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Registration failed");
    }

    const data: LoginResponse = await response.json();

    // Store auth data with complete Admin object
    const { setAuth } = useAuthStore.getState();
    const completeAdmin = {
      id: data.admin.id,
      email: data.admin.email,
      businessName: data.admin.businessName,
      contactPhone: data.admin.contactPhone || "",
      businessAddress: data.admin.businessAddress || "",
      isVerified: data.admin.isVerified || false,
      createdAt: data.admin.createdAt || new Date().toISOString(),
      updatedAt: data.admin.updatedAt || new Date().toISOString(),
    };
    setAuth(completeAdmin, data.token);

    return data;
  },
};
