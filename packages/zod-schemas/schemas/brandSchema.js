import { z } from "zod";

export const brandSchema = z.object({
  name: z.string().trim().nonempty(),
});
