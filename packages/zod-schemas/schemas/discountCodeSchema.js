import z from "zod";

export const discountCodeSchema = z
  .object({
    code: z
      .string()
      .trim()
      .nonempty()
      .regex(/^[A-Z0-9]+$/),
    usageLimit: z.coerce.number().int().min(1),
    numOfUsage: z.coerce.number().int().min(0),
    desc: z.string().trim().optional(),
  })
  .refine((data) => data.numOfUsage <= data.usageLimit, {
    message: "Number of usages cannot exceed usage limit",
    path: ["numOfUsage"],
  });
