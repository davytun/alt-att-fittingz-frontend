import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { stylesApi } from "@/lib/api/styles";
import { showToast } from "@/lib/toast";
import type {
  DeleteMultipleImagesRequest,
  UpdateStyleImageRequest,
  UploadStyleImagesRequest,
} from "@/types/style";

// Query keys
export const styleKeys = {
  all: ["styles"] as const,
  clientImages: (clientId: string) =>
    [...styleKeys.all, "client", clientId] as const,
  adminImages: () => [...styleKeys.all, "admin"] as const,
  image: (clientId: string, imageId: string) =>
    [...styleKeys.all, clientId, imageId] as const,
  count: () => [...styleKeys.all, "count"] as const,
};

// Get client style images
export const useClientStyleImages = (
  clientId: string,
  page = 1,
  pageSize = 10,
) => {
  return useQuery({
    queryKey: [...styleKeys.clientImages(clientId), page, pageSize],
    queryFn: () => stylesApi.getClientImages(clientId, page, pageSize),
    enabled: !!clientId,
  });
};

// Get admin style images
export const useAdminStyleImages = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: [...styleKeys.adminImages(), page, pageSize],
    queryFn: () => stylesApi.getAdminImages(page, pageSize),
  });
};

// Get single style image
export const useStyleImage = (clientId: string, imageId: string) => {
  return useQuery({
    queryKey: styleKeys.image(clientId, imageId),
    queryFn: () => stylesApi.getStyleImage(clientId, imageId),
    enabled: !!(clientId && imageId),
  });
};

// Get style images count
export const useStyleImagesCount = () => {
  return useQuery({
    queryKey: styleKeys.count(),
    queryFn: () => stylesApi.getStyleImagesCount(),
  });
};

// Upload client images
export const useUploadClientImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      clientId,
      data,
    }: {
      clientId: string;
      data: UploadStyleImagesRequest;
    }) => stylesApi.uploadClientImages(clientId, data),
    onSuccess: (_, { clientId }) => {
      queryClient.invalidateQueries({
        queryKey: styleKeys.clientImages(clientId),
      });
      queryClient.invalidateQueries({ queryKey: styleKeys.adminImages() });
      queryClient.invalidateQueries({ queryKey: styleKeys.count() });
      showToast.success("Images uploaded successfully");
    },
    onError: () => {
      showToast.error("Failed to upload images");
    },
  });
};

// Upload admin images
export const useUploadAdminImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UploadStyleImagesRequest) =>
      stylesApi.uploadAdminImages(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: styleKeys.adminImages() });
      queryClient.invalidateQueries({ queryKey: styleKeys.count() });
      showToast.success("Images uploaded successfully");
    },
    onError: () => {
      showToast.error("Failed to upload images");
    },
  });
};

// Update style image
export const useUpdateStyleImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      clientId,
      imageId,
      data,
    }: {
      clientId: string;
      imageId: string;
      data: UpdateStyleImageRequest;
    }) => stylesApi.updateStyleImage(clientId, imageId, data),
    onSuccess: (_, { clientId, imageId }) => {
      queryClient.invalidateQueries({
        queryKey: styleKeys.image(clientId, imageId),
      });
      queryClient.invalidateQueries({
        queryKey: styleKeys.clientImages(clientId),
      });
      queryClient.invalidateQueries({ queryKey: styleKeys.adminImages() });
      showToast.success("Image updated successfully");
    },
    onError: () => {
      showToast.error("Failed to update image");
    },
  });
};

// Delete style image
export const useDeleteStyleImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      clientId,
      imageId,
    }: {
      clientId: string;
      imageId: string;
    }) => stylesApi.deleteStyleImage(clientId, imageId),
    onSuccess: (_, { clientId }) => {
      queryClient.invalidateQueries({
        queryKey: styleKeys.clientImages(clientId),
      });
      queryClient.invalidateQueries({ queryKey: styleKeys.adminImages() });
      queryClient.invalidateQueries({ queryKey: styleKeys.count() });
      showToast.success("Image deleted successfully");
    },
    onError: () => {
      showToast.error("Failed to delete image");
    },
  });
};

// Delete multiple images
export const useDeleteMultipleImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteMultipleImagesRequest) =>
      stylesApi.deleteMultipleImages(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: styleKeys.adminImages() });
      queryClient.invalidateQueries({ queryKey: styleKeys.count() });

      if (result.failedCount > 0) {
        showToast.warning(
          `${result.deletedCount} images deleted, ${result.failedCount} failed`,
        );
      } else {
        showToast.success(`${result.deletedCount} images deleted successfully`);
      }
    },
    onError: () => {
      showToast.error("Failed to delete images");
    },
  });
};
