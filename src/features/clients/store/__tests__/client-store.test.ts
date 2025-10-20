import type { Client } from "@/features/clients/types/client";
import { useClientStore } from "../client-store";

const mockClient: Client = {
  id: "1",
  name: "John Doe",
  phone: "1234567890",
  email: "john@example.com",
  eventType: "Wedding",
  favoriteColors: [],
  dislikedColors: [],
  preferredStyles: [],
  bodyShape: "",
  additionalDetails: "",
  adminId: "admin1",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  measurements: [],
  styleImages: [],
  _count: { measurements: 0, styleImages: 0 },
};

describe("Client Store", () => {
  beforeEach(() => {
    useClientStore.setState({
      selectedClient: null,
      clients: [],
    });
  });

  it("should set selected client", () => {
    const { setSelectedClient } = useClientStore.getState();

    setSelectedClient(mockClient);

    expect(useClientStore.getState().selectedClient).toEqual(mockClient);
  });

  it("should set clients", () => {
    const { setClients } = useClientStore.getState();
    const clients = [mockClient];

    setClients(clients);

    expect(useClientStore.getState().clients).toEqual(clients);
  });

  it("should add client", () => {
    const { addClient } = useClientStore.getState();

    addClient(mockClient);

    expect(useClientStore.getState().clients).toEqual([mockClient]);
  });

  it("should update client", () => {
    const { setClients, updateClient } = useClientStore.getState();

    setClients([mockClient]);
    const updatedClient = { ...mockClient, name: "Updated Name" };
    updateClient(updatedClient);

    expect(useClientStore.getState().clients[0].name).toBe("Updated Name");
  });

  it("should update selected client when it matches updated client", () => {
    const { setClients, setSelectedClient, updateClient } =
      useClientStore.getState();

    setClients([mockClient]);
    setSelectedClient(mockClient);
    const updatedClient = { ...mockClient, name: "Updated Name" };
    updateClient(updatedClient);

    expect(useClientStore.getState().selectedClient?.name).toBe("Updated Name");
  });

  it("should remove client", () => {
    const { setClients, removeClient } = useClientStore.getState();

    setClients([mockClient]);
    removeClient("1");

    expect(useClientStore.getState().clients).toHaveLength(0);
  });

  it("should clear selected client when it matches removed client", () => {
    const { setClients, setSelectedClient, removeClient } =
      useClientStore.getState();

    setClients([mockClient]);
    setSelectedClient(mockClient);
    removeClient("1");

    expect(useClientStore.getState().selectedClient).toBeNull();
  });
});
