import { z } from "zod";

export const variantSchema = z.object({
  name: z.string().trim().nonempty(),
  desc: z.string().trim().optional(),
  price: z.coerce.number().int().min(0),
  stockQuantity: z.coerce.number().int().min(0),
  productSlug: z.string().trim().nonempty(),
});
