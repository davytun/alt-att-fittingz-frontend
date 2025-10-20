import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "../schemas/auth-schemas";

describe("Auth Schemas", () => {
  describe("loginSchema", () => {
    it("should validate correct login data", () => {
      const validData = {
        email: "test@example.com",
        password: "password123",
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const invalidData = {
        email: "invalid-email",
        password: "password123",
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Invalid email address");
      }
    });

    it("should reject empty password", () => {
      const invalidData = {
        email: "test@example.com",
        password: "",
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Password is required");
      }
    });
  });

  describe("registerSchema", () => {
    const validRegisterData = {
      email: "test@example.com",
      password: "Password123!",
      confirmPassword: "Password123!",
      businessName: "Test Business",
      contactPhone: "1234567890",
      businessAddress: "123 Test Street",
    };

    it("should validate correct registration data", () => {
      const result = registerSchema.safeParse(validRegisterData);
      expect(result.success).toBe(true);
    });

    it("should reject weak password", () => {
      const invalidData = {
        ...validRegisterData,
        password: "weak",
        confirmPassword: "weak",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject mismatched passwords", () => {
      const invalidData = {
        ...validRegisterData,
        confirmPassword: "DifferentPassword123!",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Passwords don't match");
      }
    });

    it("should reject short phone number", () => {
      const invalidData = {
        ...validRegisterData,
        contactPhone: "123",
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Phone number must be at least 10 digits",
        );
      }
    });
  });

  describe("verifyEmailSchema", () => {
    it("should validate correct verification data", () => {
      const validData = {
        email: "test@example.com",
        verificationCode: "123456",
      };

      const result = verifyEmailSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid verification code length", () => {
      const invalidData = {
        email: "test@example.com",
        verificationCode: "123",
      };

      const result = verifyEmailSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Verification code must be 6 digits",
        );
      }
    });

    it("should reject non-numeric verification code", () => {
      const invalidData = {
        email: "test@example.com",
        verificationCode: "abc123",
      };

      const result = verifyEmailSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Verification code must contain only numbers",
        );
      }
    });
  });

  describe("forgotPasswordSchema", () => {
    it("should validate correct email", () => {
      const validData = { email: "test@example.com" };
      const result = forgotPasswordSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const invalidData = { email: "invalid-email" };
      const result = forgotPasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("resetPasswordSchema", () => {
    const validResetData = {
      email: "test@example.com",
      resetCode: "123456",
      newPassword: "NewPassword123!",
      confirmPassword: "NewPassword123!",
    };

    it("should validate correct reset password data", () => {
      const result = resetPasswordSchema.safeParse(validResetData);
      expect(result.success).toBe(true);
    });

    it("should reject mismatched passwords", () => {
      const invalidData = {
        ...validResetData,
        confirmPassword: "DifferentPassword123!",
      };

      const result = resetPasswordSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Passwords don't match");
      }
    });
  });
});
