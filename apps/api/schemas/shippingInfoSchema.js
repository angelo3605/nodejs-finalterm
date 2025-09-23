import { z } from "zod";

export const ShippingInfoSchema = z.object({
  street: z.string().min(1),
  phoneNumber: z.string().min(1),
  fullName: z.string().min(1),
});
