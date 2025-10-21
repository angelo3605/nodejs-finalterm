import { z } from "zod";

export const variantSchema = z.object({
  name: z.string().min(1).trim(),
  desc: z.string().trim().optional(),
  price: z.float32().positive().min(0.0),
  stockQuantity: z.int().positive().min(0),
  productSlug: z.string().min(1).trim(),
});
