import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().nonempty(),
  desc: z.string().trim().optional(),
  imageUrl: z.string().trim().optional(),
});
