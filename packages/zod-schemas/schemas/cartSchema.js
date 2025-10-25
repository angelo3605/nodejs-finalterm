import { z } from "zod";

export const cartSchema = z.object({
  variantId: z.string().min(1).trim(),
  amount: z.coerce.number(),
});
