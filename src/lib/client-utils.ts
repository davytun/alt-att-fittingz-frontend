import type { Client } from "@/lib/api/types";

// Format client data for display
export const formatClientName = (client: Client): string => {
  return client.name;
};

export const formatClientContact = (client: Client): string => {
  return `${client.phone} • ${client.email}`;
};

export const formatGender = (gender: string): string => {
  return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
};

// Filter and search utilities
export const filterClientsByName = (
  clients: Client[],
  searchTerm: string,
): Client[] => {
  if (!searchTerm) return clients;

  return clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm),
  );
};

export const filterClientsByGender = (
  clients: Client[],
  gender: string,
): Client[] => {
  if (!gender) return clients;

  return clients.filter(
    (client) => client.gender.toLowerCase() === gender.toLowerCase(),
  );
};

// Validation utilities
interface ClientFormData {
  name?: string;
  phone?: string;
  email?: string;
  gender?: string;
}

export const validateClientData = (data: Record<string, unknown>): string[] => {
  const clientData = data as ClientFormData;
  const errors: string[] = [];

  if (!clientData.name?.trim()) {
    errors.push("Name is required");
  }

  if (!clientData.phone?.trim()) {
    errors.push("Phone is required");
  } else if (clientData.phone.length < 10) {
    errors.push("Phone number must be at least 10 digits");
  }

  if (!clientData.email?.trim()) {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientData.email)) {
    errors.push("Invalid email format");
  }

  if (!clientData.gender?.trim()) {
    errors.push("Gender is required");
  }

  return errors;
};

// Export utilities for CSV or other formats
export const exportClientsToCSV = (clients: Client[]): string => {
  const headers = ["Name", "Phone", "Email", "Gender", "Created At"];
  const rows = clients.map((client) => [
    client.name,
    client.phone,
    client.email,
    client.gender,
    new Date(client.createdAt).toLocaleDateString(),
  ]);

  return [headers, ...rows].map((row) => row.join(",")).join("\n");
};
