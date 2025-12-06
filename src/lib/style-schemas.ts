import { z } from "zod";

export const uploadStyleImagesSchema = z.object({
  images: z.array(z.instanceof(File)).min(1, "At least one image is required"),
  category: z.string().optional(),
  description: z.string().optional(),
});

export const updateStyleImageSchema = z.object({
  category: z.string().optional(),
  description: z.string().optional(),
});

export const deleteMultipleImagesSchema = z.object({
  imageIds: z.array(z.string()).min(1, "At least one image ID is required"),
});

export type UploadStyleImagesFormData = z.infer<typeof uploadStyleImagesSchema>;
export type UpdateStyleImageFormData = z.infer<typeof updateStyleImageSchema>;
export type DeleteMultipleImagesFormData = z.infer<
  typeof deleteMultipleImagesSchema
>;
