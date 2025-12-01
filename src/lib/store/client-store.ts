import { create } from "zustand";
import type { Client } from "@/types/client";

interface ClientStore {
  selectedClient: Client | null;
  clients: Client[];
  setSelectedClient: (client: Client | null) => void;
  setClients: (clients: Client[]) => void;
  addClient: (client: Client) => void;
  updateClient: (client: Client) => void;
  removeClient: (clientId: string) => void;
}

export const useClientStore = create<ClientStore>((set, _get) => ({
  selectedClient: null,
  clients: [],

  setSelectedClient: (client) => set({ selectedClient: client }),

  setClients: (clients) => set({ clients }),

  addClient: (client) =>
    set((state) => ({
      clients: [client, ...state.clients],
    })),

  updateClient: (updatedClient) =>
    set((state) => ({
      clients: state.clients.map((client) =>
        client.id === updatedClient.id ? updatedClient : client,
      ),
      selectedClient:
        state.selectedClient?.id === updatedClient.id
          ? updatedClient
          : state.selectedClient,
    })),

  removeClient: (clientId) =>
    set((state) => ({
      clients: state.clients.filter((client) => client.id !== clientId),
      selectedClient:
        state.selectedClient?.id === clientId ? null : state.selectedClient,
    })),
}));
