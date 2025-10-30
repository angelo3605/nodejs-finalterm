import { z } from "zod";

export const imageSchema = z.object({
  altText: z.string().trim().nonempty(),
});
