import z from "zod";

import { DiscountTypeEnum } from "./enumSchema.js";

export const discountCodeSchema = z.object({
  code: z.string().regex(/^[A-Za-z0-9]{5}$/),
  desc: z.string().trim().optional(),
  type: DiscountTypeEnum,
  value: z.number().lt(100),
  usageLimit: z.number().int().max(10).optional(),
});
