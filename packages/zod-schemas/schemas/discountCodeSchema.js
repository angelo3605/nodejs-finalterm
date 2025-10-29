import z from "zod";

export const discountCodeSchema = z
  .object({
    code: z
      .string()
      .trim()
      .nonempty()
      .regex(/^[A-Z0-9]+$/),
    type: z.enum(["PERCENTAGE", "FIXED"]),
    value: z.coerce.number().min(0.0),
    usageLimit: z.coerce.number().int().min(1),
    numOfUsage: z.coerce.number().int().min(0),
    desc: z.string().trim().optional(),
  })
  .refine((data) => data.numOfUsage <= data.usageLimit, {
    message: "Number of usages cannot exceed usage limit",
    path: ["numOfUsage"],
  })
  .refine((data) => data.type === "FIXED" || data.value <= 100, {
    message: "Percentage-type discount code value must be between 0 and 100",
    path: ["value"],
  });
