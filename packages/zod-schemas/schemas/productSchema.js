import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().nonempty(),
  desc: z.string().trim().optional(),
  imageUrls: z.array(z.url().trim()).optional(),
  brand: z.string().trim().nonempty().optional(),
  category: z.string().trim().nonempty().optional(),
});
