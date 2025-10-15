import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1).trim(),
  desc: z.string().trim().optional(),
  imageUrl: z.url().trim().optional(),
});
