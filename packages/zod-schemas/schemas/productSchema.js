import { z } from "zod";

export const productVariantSchema = z.object({
  name: z.string().min(1).trim(),
  price: z.number().positive().min(0.0),
  stockQuantity: z.int().positive().min(0),
});

export const productSchema = z.object({
  name: z.string().min(1).trim(),
  desc: z.string().trim().optional(),
  brand: z.string().min(1).trim().optional(),
  category: z.string().min(1).trim().optional(),
  variants: z.array(productVariantSchema).optional(),
  imageUrls: z.array(z.url().trim()).optional(),
});
