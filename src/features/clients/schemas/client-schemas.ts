import { z } from "zod";

export const createClientSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long"),
  email: z.email("Invalid email address"),
  eventType: z
    .string()
    .min(1, "Event type is required")
    .max(50, "Event type is too long"),
});

export const updateClientSchema = createClientSchema.partial();

export type CreateClientFormData = z.infer<typeof createClientSchema>;
export type UpdateClientFormData = z.infer<typeof updateClientSchema>;
