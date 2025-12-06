import type {
  DeleteMultipleImagesRequest,
  DeleteMultipleImagesResponse,
  StyleImage,
  StyleImageCountResponse,
  StyleImagesResponse,
  UpdateStyleImageRequest,
  UploadStyleImagesRequest,
} from "@/types/style";
import { apiClient } from "./client";

const createFormData = (data: UploadStyleImagesRequest): FormData => {
  const formData = new FormData();

  data.images.forEach((image) => {
    formData.append("images", image);
  });

  if (data.category) formData.append("category", data.category);
  if (data.description) formData.append("description", data.description);

  return formData;
};

export const stylesApi = {
  // Upload images for client
  uploadClientImages: async (
    clientId: string,
    data: UploadStyleImagesRequest,
  ): Promise<StyleImage[]> => {
    // Get token from Zustand auth storage
    const authStorage = localStorage.getItem("auth-storage");
    let token = null;

    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        token = parsed?.state?.token;
      } catch (e) {
        console.error("Failed to parse auth storage:", e);
      }
    }

    const API_URL =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://chosen-ophelia-daviwhizzy1-992ca0bc.koyeb.app/api/v1";

    console.log("Upload request:", {
      clientId,
      token: token ? "present" : "missing",
    });

    const response = await fetch(
      `${API_URL}/clients/${clientId}/styles/upload`,
      {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: createFormData(data),
      },
    );

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Upload failed" }));
      console.error("Upload failed:", error, response.status);
      throw new Error(
        error.message || `Upload failed with status ${response.status}`,
      );
    }

    return response.json();
  },

  // Upload images for admin
  uploadAdminImages: async (
    data: UploadStyleImagesRequest,
  ): Promise<StyleImage[]> => {
    // Get token from Zustand auth storage
    const authStorage = localStorage.getItem("auth-storage");
    let token = null;

    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        token = parsed?.state?.token;
      } catch (e) {
        console.error("Failed to parse auth storage:", e);
      }
    }

    const API_URL =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://chosen-ophelia-daviwhizzy1-992ca0bc.koyeb.app/api/v1";

    console.log("Admin upload request:", {
      token: token ? "present" : "missing",
    });

    const response = await fetch(`${API_URL}/admin/styles/upload`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      body: createFormData(data),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Upload failed" }));
      console.error("Admin upload failed:", error, response.status);
      throw new Error(
        error.message || `Upload failed with status ${response.status}`,
      );
    }

    return response.json();
  },

  // Get client style images
  getClientImages: (
    clientId: string,
    page = 1,
    pageSize = 10,
  ): Promise<StyleImagesResponse> =>
    apiClient(`/clients/${clientId}/styles?page=${page}&pageSize=${pageSize}`),

  // Get admin style images
  getAdminImages: (page = 1, pageSize = 10): Promise<StyleImagesResponse> =>
    apiClient(`/admin/styles?page=${page}&pageSize=${pageSize}`),

  // Get single style image
  getStyleImage: (clientId: string, imageId: string): Promise<StyleImage> =>
    apiClient(`/clients/${clientId}/styles/${imageId}`),

  // Update style image
  updateStyleImage: (
    clientId: string,
    imageId: string,
    data: UpdateStyleImageRequest,
  ): Promise<StyleImage> =>
    apiClient(`/clients/${clientId}/styles/${imageId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Delete style image
  deleteStyleImage: (
    clientId: string,
    imageId: string,
  ): Promise<{ message: string }> =>
    apiClient(`/clients/${clientId}/styles/${imageId}`, {
      method: "DELETE",
    }),

  // Get style images count
  getStyleImagesCount: (): Promise<StyleImageCountResponse> =>
    apiClient("/admin/styles/count"),

  // Delete multiple images
  deleteMultipleImages: (
    data: DeleteMultipleImagesRequest,
  ): Promise<DeleteMultipleImagesResponse> =>
    apiClient("/admin/styles/delete-multiple", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
