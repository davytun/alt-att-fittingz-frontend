import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast";
import {
  type ClientError,
  clientAPI,
} from "@/features/clients/services/client-api";
import type { UpdateClientRequest } from "@/features/clients/types/client";

export const useCreateClientMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: clientAPI.createClient,
    onSuccess: (data) => {
      // Invalidate and refetch clients list
      queryClient.invalidateQueries({ queryKey: ["clients"] });

      showToast({
        title: "Client Created",
        description: `${data.name} has been added successfully.`,
        type: "success",
      });
    },
    onError: (error: ClientError) => {
      console.error("Create client error:", error);

      const errorMessage =
        error?.message || "Failed to create client. Please try again.";
      showToast({
        title: "Creation Failed",
        description: errorMessage,
        type: "error",
      });
    },
  });
};

export const useUpdateClientMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientRequest }) =>
      clientAPI.updateClient(id, data),
    onSuccess: (data) => {
      // Invalidate both clients list and specific client
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["client", data.id] });

      showToast({
        title: "Client Updated",
        description: `${data.name} has been updated successfully.`,
        type: "success",
      });
    },
    onError: (error: ClientError) => {
      console.error("Update client error:", error);

      const errorMessage =
        error?.message || "Failed to update client. Please try again.";
      showToast({
        title: "Update Failed",
        description: errorMessage,
        type: "error",
      });
    },
  });
};

export const useDeleteClientMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: clientAPI.deleteClient,
    onSuccess: (data, variables) => {
      // Invalidate clients list
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      // Remove specific client from cache
      queryClient.removeQueries({ queryKey: ["client", variables] });

      showToast({
        title: "Client Deleted",
        description: data.message || "Client has been deleted successfully.",
        type: "success",
      });
    },
    onError: (error: ClientError) => {
      console.error("Delete client error:", error);

      const errorMessage =
        error?.message || "Failed to delete client. Please try again.";
      showToast({
        title: "Deletion Failed",
        description: errorMessage,
        type: "error",
      });
    },
  });
};
