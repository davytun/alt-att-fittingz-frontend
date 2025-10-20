import { createClientSchema, updateClientSchema } from "../client-schemas";

describe("Client Schemas", () => {
  const validClientData = {
    name: "John Doe",
    phone: "1234567890",
    email: "john@example.com",
    eventType: "Wedding",
    favoriteColors: ["Blue", "Red"],
    dislikedColors: ["Green"],
    preferredStyles: ["Casual", "Formal"],
    bodyShape: "Pear",
    additionalDetails: "Prefers lightweight fabrics",
  };

  describe("createClientSchema", () => {
    it("should validate correct client data", () => {
      expect(() => createClientSchema.parse(validClientData)).not.toThrow();
    });

    it("should require name", () => {
      const invalidData = { ...validClientData, name: "" };
      expect(() => createClientSchema.parse(invalidData)).toThrow(
        "Name is required",
      );
    });

    it("should validate name length", () => {
      const invalidData = { ...validClientData, name: "a".repeat(101) };
      expect(() => createClientSchema.parse(invalidData)).toThrow(
        "Name is too long",
      );
    });

    it("should require phone", () => {
      const invalidData = { ...validClientData, phone: "" };
      expect(() => createClientSchema.parse(invalidData)).toThrow(
        "Phone number must be at least 10 digits",
      );
    });

    it("should validate phone length", () => {
      const invalidData = { ...validClientData, phone: "123" };
      expect(() => createClientSchema.parse(invalidData)).toThrow(
        "Phone number must be at least 10 digits",
      );
    });

    it("should require valid email", () => {
      const invalidData = { ...validClientData, email: "invalid-email" };
      expect(() => createClientSchema.parse(invalidData)).toThrow(
        "Invalid email address",
      );
    });

    it("should require event type", () => {
      const invalidData = { ...validClientData, eventType: "" };
      expect(() => createClientSchema.parse(invalidData)).toThrow(
        "Event type is required",
      );
    });

    it("should validate color array items length", () => {
      const invalidData = {
        ...validClientData,
        favoriteColors: ["a".repeat(31)],
      };
      expect(() => createClientSchema.parse(invalidData)).toThrow(
        "Color name is too long",
      );
    });

    it("should validate style array items length", () => {
      const invalidData = {
        ...validClientData,
        preferredStyles: ["a".repeat(51)],
      };
      expect(() => createClientSchema.parse(invalidData)).toThrow(
        "Style name is too long",
      );
    });

    it("should set default values for optional arrays", () => {
      const data = {
        name: "John Doe",
        phone: "1234567890",
        email: "john@example.com",
        eventType: "Wedding",
      };

      const result = createClientSchema.parse(data);
      expect(result.favoriteColors).toEqual([]);
      expect(result.dislikedColors).toEqual([]);
      expect(result.preferredStyles).toEqual([]);
    });

    it("should allow optional fields to be empty", () => {
      const data = {
        ...validClientData,
        bodyShape: "",
        additionalDetails: "",
      };

      expect(() => createClientSchema.parse(data)).not.toThrow();
    });
  });

  describe("updateClientSchema", () => {
    it("should allow partial updates", () => {
      const partialData = {
        name: "Updated Name",
        email: "updated@example.com",
      };

      expect(() => updateClientSchema.parse(partialData)).not.toThrow();
    });

    it("should validate fields when provided", () => {
      const invalidPartialData = {
        name: "",
        email: "invalid-email",
      };

      expect(() => updateClientSchema.parse(invalidPartialData)).toThrow();
    });

    it("should allow empty update object", () => {
      expect(() => updateClientSchema.parse({})).not.toThrow();
    });
  });
});
