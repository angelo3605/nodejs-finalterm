import { z } from "zod";
import { phoneNumberSchema } from "./shippingAddressSchema.js";

export const checkoutSchema = z.object({
  discountCode: z
    .string()
    .trim()
    .regex(/^[A-Z0-9]*$/)
    .optional(),
});

export const userCheckoutSchema = checkoutSchema.extend({
  loyaltyPointsToUse: z
    .any()
    .transform((v) => {
      const _v = Number(v);
      return isNaN(_v) ? 0 : Math.max(_v, 0);
    })
    .optional(),
  shippingAddressId: z.string().trim().nonempty(),
});

export const guestCheckoutSchema = checkoutSchema.extend({
  email: z.email().trim().nonempty(),
  fullName: z.string().trim().nonempty(),
  phoneNumber: phoneNumberSchema,
  address: z.string().trim().nonempty(),
  district: z.string().trim().nonempty(),
  province: z.string().trim().nonempty(),
  ward: z.string().trim().optional(),
});
