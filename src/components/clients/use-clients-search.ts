import { create } from "zustand";

interface ClientsSearchState {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const useClientsSearch = create<ClientsSearchState>((set) => ({
  searchTerm: "",
  setSearchTerm: (term) => set({ searchTerm: term }),
}));
