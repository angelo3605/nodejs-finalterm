import z from "zod";

export const commentSchema = z.object({
  message: z.string().trim().optional(),
  parentId: z
    .string()
    .trim()
    .nonempty()
    .regex(/^[A-Fa-f0-9]{24}$/),
});
