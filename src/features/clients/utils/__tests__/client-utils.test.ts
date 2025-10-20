import type { Client } from "@/features/clients/types/client";
import {
  exportClientsToCSV,
  filterClientsByEventType,
  filterClientsByName,
  formatClientContact,
  formatClientName,
  formatEventType,
  validateClientData,
} from "../client-utils";

const mockClient: Client = {
  id: "1",
  name: "John Doe",
  phone: "1234567890",
  email: "john@example.com",
  eventType: "wedding",
  favoriteColors: ["Blue"],
  dislikedColors: [],
  preferredStyles: ["Formal"],
  bodyShape: "Pear",
  additionalDetails: "Test details",
  adminId: "admin1",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  measurements: [],
  styleImages: [],
  _count: {
    measurements: 0,
    styleImages: 0,
  },
};

const mockClients: Client[] = [
  mockClient,
  {
    ...mockClient,
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "0987654321",
    eventType: "corporate",
  },
  {
    ...mockClient,
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    phone: "5556667777",
    eventType: "wedding",
  },
];

describe("Client Utilities", () => {
  describe("formatClientName", () => {
    it("should format client name correctly", () => {
      expect(formatClientName(mockClient)).toBe("John Doe");
    });
  });

  describe("formatClientContact", () => {
    it("should format client contact information", () => {
      expect(formatClientContact(mockClient)).toBe(
        "1234567890 • john@example.com",
      );
    });
  });

  describe("formatEventType", () => {
    it("should capitalize event type", () => {
      expect(formatEventType("wedding")).toBe("Wedding");
      expect(formatEventType("CORPORATE")).toBe("Corporate");
      expect(formatEventType("birthday party")).toBe("Birthday party");
    });
  });

  describe("filterClientsByName", () => {
    it("should filter clients by name", () => {
      const result = filterClientsByName(mockClients, "john");
      expect(result).toHaveLength(2); // John Doe and Bob Johnson
      expect(result[0].name).toBe("John Doe");
      expect(result[1].name).toBe("Bob Johnson");
    });

    it("should filter clients by email", () => {
      const result = filterClientsByName(mockClients, "jane@example.com");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Jane Smith");
    });

    it("should filter clients by phone", () => {
      const result = filterClientsByName(mockClients, "5556667777");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Bob Johnson");
    });

    it("should return all clients when search term is empty", () => {
      const result = filterClientsByName(mockClients, "");
      expect(result).toEqual(mockClients);
    });

    it("should be case insensitive", () => {
      const result = filterClientsByName(mockClients, "JOHN");
      expect(result).toHaveLength(2);
    });
  });

  describe("filterClientsByEventType", () => {
    it("should filter clients by event type", () => {
      const result = filterClientsByEventType(mockClients, "wedding");
      expect(result).toHaveLength(2);
      expect(
        result.every((client) => client.eventType.toLowerCase() === "wedding"),
      ).toBe(true);
    });

    it("should return all clients when event type is empty", () => {
      const result = filterClientsByEventType(mockClients, "");
      expect(result).toEqual(mockClients);
    });

    it("should be case insensitive", () => {
      const result = filterClientsByEventType(mockClients, "WEDDING");
      expect(result).toHaveLength(2);
    });
  });

  describe("validateClientData", () => {
    it("should validate correct client data", () => {
      const validData = {
        name: "John Doe",
        phone: "1234567890",
        email: "john@example.com",
        eventType: "Wedding",
      };

      const errors = validateClientData(validData);
      expect(errors).toHaveLength(0);
    });

    it("should catch missing required fields", () => {
      const invalidData = {
        name: "",
        phone: "",
        email: "",
        eventType: "",
      };

      const errors = validateClientData(invalidData);
      expect(errors).toContain("Name is required");
      expect(errors).toContain("Phone is required");
      expect(errors).toContain("Email is required");
      expect(errors).toContain("Event type is required");
    });

    it("should validate phone number length", () => {
      const invalidData = {
        name: "John Doe",
        phone: "123",
        email: "john@example.com",
        eventType: "Wedding",
      };

      const errors = validateClientData(invalidData);
      expect(errors).toContain("Phone number must be at least 10 digits");
    });

    it("should validate email format", () => {
      const invalidData = {
        name: "John Doe",
        phone: "1234567890",
        email: "invalid-email",
        eventType: "Wedding",
      };

      const errors = validateClientData(invalidData);
      expect(errors).toContain("Invalid email format");
    });
  });

  describe("exportClientsToCSV", () => {
    it("should export clients to CSV format", () => {
      const csv = exportClientsToCSV(mockClients);

      const lines = csv.split("\n");
      expect(lines[0]).toBe(
        "Name,Phone,Email,Event Type,Body Shape,Created At",
      );
      expect(lines[1]).toContain("John Doe");
      expect(lines[1]).toContain("1234567890");
      expect(lines[1]).toContain("john@example.com");
      expect(lines[1]).toContain("wedding");
      expect(lines[1]).toContain("Pear");
    });

    it("should handle clients without body shape", () => {
      const clientWithoutBodyShape = {
        ...mockClient,
        bodyShape: "",
      };

      const csv = exportClientsToCSV([clientWithoutBodyShape]);
      expect(csv).toContain("N/A");
    });
  });
});
