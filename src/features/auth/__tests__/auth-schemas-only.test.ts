import { loginSchema, registerSchema } from '../schemas/auth-schemas';

describe('Auth Schemas Only', () => {
  it('should validate login', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(result.success).toBe(true);
  });

  it('should validate register', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      businessName: 'Test Business',
      contactPhone: '1234567890',
      businessAddress: '123 Test Street'
    });
    expect(result.success).toBe(true);
  });
});