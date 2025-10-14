import z, { ZodError } from "zod";

export const validate = (schema) => (req, res, next) => {
  const parsed = schema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      errors: z.flattenError(parsed.error),
    });
  }

  req.body = parsed.data;
  next();
};
