import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type Admin, apiClient, endpoints } from "@/api";

export function useUser() {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: () => apiClient<Admin>(endpoints.users.me),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Admin>) =>
      apiClient<Admin>(endpoints.users.me, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}
