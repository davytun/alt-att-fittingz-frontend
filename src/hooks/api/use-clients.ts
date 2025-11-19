import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  apiClient,
  type Client,
  type CreateClientData,
  endpoints,
} from "@/api";

export function useClientList(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["clients", "list", page, limit],
    queryFn: () =>
      apiClient<{
        data: Client[];
        pagination: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }>(`${endpoints.clients.list}?page=${page}&limit=${limit}`),
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ["clients", "detail", id],
    queryFn: () => apiClient<Client>(endpoints.clients.byId(id)),
    enabled: !!id,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClientData) =>
      apiClient<Client>(endpoints.clients.create, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Client Created", {
        description: "Client has been successfully created.",
      });
    },
    onError: () => {
      toast.error("Failed to Create Client", {
        description: "Please try again.",
      });
    },
  });
}

export function useUpdateClient(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CreateClientData>) =>
      apiClient<Client>(endpoints.clients.update(id), {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Client Updated", {
        description: "Client has been successfully updated.",
      });
    },
    onError: () => {
      toast.error("Failed to Update Client", {
        description: "Please try again.",
      });
    },
  });
}
