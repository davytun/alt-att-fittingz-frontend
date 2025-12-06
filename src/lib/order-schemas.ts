import { z } from "zod";

export const orderDetailsSchema = z.object({
  fabric: z.string().min(1, "Fabric is required"),
  color: z.string().min(1, "Color is required"),
  notes: z.string().optional().default(""),
});

export const orderStatusSchema = z.enum([
  "PENDING_PAYMENT",
  "PROCESSING",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]);

export const createOrderSchema = z.object({
  details: orderDetailsSchema,
  price: z.number().min(0, "Price must be positive"),
  currency: z.string().default("NGN"),
  dueDate: z.string().min(1, "Due date is required"),
  status: orderStatusSchema.default("PENDING_PAYMENT"),
  projectId: z.string().optional(),
  eventId: z.string().optional(),
  deposit: z.number().min(0, "Deposit must be positive").default(0),
  styleDescription: z.string().min(1, "Style description is required"),
  styleImageIds: z.array(z.string()).optional().default([]),
  note: z.string().optional().default(""),
  measurementId: z.string().optional(),
});

export const updateOrderSchema = createOrderSchema.partial();

export const updateOrderStatusSchema = z.object({
  status: orderStatusSchema,
});

export type CreateOrderFormData = z.infer<typeof createOrderSchema>;
export type UpdateOrderFormData = z.infer<typeof updateOrderSchema>;
export type UpdateOrderStatusFormData = z.infer<typeof updateOrderStatusSchema>;
