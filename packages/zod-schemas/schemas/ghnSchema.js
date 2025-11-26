import { z } from "zod";

export const ghnSchema = z.object({
  id: z.string().trim().nonempty(),
  width: z.coerce.number().int().min(1).max(200),
  height: z.coerce.number().int().min(1).max(200),
  length: z.coerce.number().int().min(1).max(200),
  weight: z.coerce.number().int().min(1).max(50_000),
});
