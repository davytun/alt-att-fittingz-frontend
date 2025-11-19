import { z } from "zod";

// Base schema for client data (shared between forms and API)
export const clientBaseSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  gender: z.string().min(1, "Gender is required").max(50, "Gender is too long"),
  favoriteColors: z
    .array(z.string().max(30, "Color name is too long"))
    .default([]),
  dislikedColors: z
    .array(z.string().max(30, "Color name is too long"))
    .default([]),
  preferredStyles: z
    .array(z.string().max(50, "Style name is too long"))
    .default([]),
  bodyShape: z.string().optional().default(""),
  additionalDetails: z.string().optional().default(""),
});

// Form schema (extends base with form-specific validations)
export const createClientSchema = clientBaseSchema;

export const updateClientSchema = createClientSchema.partial();

// API Response Schemas
export const measurementSchema = z.object({
  id: z.string(),
  fields: z.record(z.string(), z.unknown()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const styleImageSchema = z.object({
  id: z.string(),
  imageUrl: z.string().url(),
  publicId: z.string(),
  category: z.string(),
  description: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Full client schema from API (includes all fields returned by backend)
export const clientResponseSchema = clientBaseSchema.extend({
  id: z.string(),
  adminId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  measurements: z.array(measurementSchema).default([]),
  styleImages: z.array(styleImageSchema).default([]),
  _count: z
    .object({
      measurements: z.number(),
      styleImages: z.number(),
      orders: z.number().optional(),
    })
    .default({ measurements: 0, styleImages: 0, orders: 0 }),
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

// Clients list response schema
export const clientsResponseSchema = z.object({
  data: z.array(clientResponseSchema),
  pagination: paginationSchema,
});

// Single client response schema
export const clientSingleResponseSchema = z.object({
  data: clientResponseSchema,
});

// Delete response schema
export const deleteClientResponseSchema = z.object({
  message: z.string(),
});

// Type exports (inferred from schemas)
export type CreateClientFormData = z.input<typeof createClientSchema>;
export type UpdateClientFormData = z.infer<typeof updateClientSchema>;
export type Client = z.infer<typeof clientResponseSchema>;
export type Measurement = z.infer<typeof measurementSchema>;
export type StyleImage = z.infer<typeof styleImageSchema>;
export type ClientsResponse = z.infer<typeof clientsResponseSchema>;
export type ClientResponse = z.infer<typeof clientSingleResponseSchema>;
export type DeleteClientResponse = z.infer<typeof deleteClientResponseSchema>;
