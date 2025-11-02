import z from "zod";

export const ratingSchema = z.object({
  stars: z.coerce.number().int().min(0).max(5),
  review: z.string().trim().optional(),
});
