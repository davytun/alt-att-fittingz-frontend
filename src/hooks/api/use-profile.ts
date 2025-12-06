import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "@/lib/api/profile";
import type { Admin, UpdateProfileFormData } from "@/lib/auth-schemas";
import { showToast } from "@/lib/toast";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: profileApi.getProfile,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Partial<UpdateProfileFormData> & { profileImage?: File },
    ) => profileApi.updateProfile(data),
    onSuccess: (updatedProfile: Admin) => {
      queryClient.setQueryData(["profile"], updatedProfile);
      showToast.success("Profile updated successfully");
    },
    onError: (error: Error) => {
      showToast.error(error.message || "Failed to update profile");
    },
  });
}
