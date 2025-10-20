import { useQuery } from "@tanstack/react-query";
import {
  type ClientError,
  clientAPI,
} from "@/features/clients/services/client-api";

export const useClients = (page: number = 1, pageSize: number = 10) => {
  return useQuery({
    queryKey: ["clients", page, pageSize],
    queryFn: () => clientAPI.getClients(page, pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: ClientError) => {
      // Don't retry on 4xx errors
      if (error.status && error.status >= 400 && error.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useClient = (id: string) => {
  return useQuery({
    queryKey: ["client", id],
    queryFn: () => clientAPI.getClientById(id),
    enabled: !!id, // Only run if ID is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: ClientError) => {
      // Don't retry on 404 or 403 errors
      if (error.status === 404 || error.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};
