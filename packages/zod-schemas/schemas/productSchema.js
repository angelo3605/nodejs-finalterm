import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1).trim(),
  desc: z.string().trim().optional(),
  imageUrls: z.array(z.url().trim()).optional(),
  brand: z.string().min(1).trim().optional(),
  category: z.string().min(1).trim().optional(),
});
