import { z } from "zod";

export const AdminSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  businessName: z.string(),
  contactPhone: z.string(),
  businessAddress: z.string(),
  isVerified: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ClientSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  gender: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  _count: z.object({
    measurements: z.number(),
    styleImages: z.number(),
  }),
});

export const AuthResponseSchema = z.object({
  admin: AdminSchema,
  token: z.string(),
  message: z.string().optional(),
});

export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    message: z.string().optional(),
    pagination: z
      .object({
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
      })
      .optional(),
  });

export type Admin = z.infer<typeof AdminSchema>;
export type Client = z.infer<typeof ClientSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type CreateClientData = Pick<
  Client,
  "name" | "email" | "phone" | "gender"
>;
export type UpdateClientData = Partial<CreateClientData>;

export interface AppError {
  status: number;
  message: string;
  errors?: Array<{
    msg: string;
    param: string;
    location: string;
    value: string;
  }>;
  errorType?: string;
}
