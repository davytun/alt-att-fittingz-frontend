import { AuthenticatedClient } from "./auth-client";
import { endpoints } from "./endpoints";
import type { Admin, UpdateProfileFormData } from "../auth-schemas";
import { API_CONFIG } from "../config";
import { useAuthStore } from "../store/auth-store";

export const profileApi = {
  async getProfile(): Promise<Admin> {
    return AuthenticatedClient.get<Admin>(endpoints.profile.get);
  },

  async updateProfile(data: Partial<UpdateProfileFormData> & { profileImage?: File }): Promise<Admin> {
    const formData = new FormData();
    
    if (data.businessName) formData.append("businessName", data.businessName);
    if (data.contactPhone) formData.append("contactPhone", data.contactPhone);
    if (data.businessAddress) formData.append("businessAddress", data.businessAddress);
    if (data.profileImage) formData.append("profileImage", data.profileImage);

    const { token } = useAuthStore.getState();
    const response = await fetch(`${API_CONFIG.API_URL}${endpoints.profile.update}`, {
      method: "PATCH",
      body: formData,
      credentials: "include",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to update profile");
    }

    return response.json();
  },
};