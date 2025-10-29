import { z } from "zod";

export const cartSchema = z
  .object({
    variantId: z.string().min(1).trim(),
    amount: z.coerce.number().int().optional(),
    deleteItem: z.coerce.boolean().default(false),
  })
  .refine((data) => data.amount !== undefined || data.deleteItem, {
    message: "Either amount must be provided or deleteItem must set to true",
    path: ["amount"],
  });
