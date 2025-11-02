import z from "zod";
import { shippingAddressSchema } from "./shippingAddressSchema.js";
import { discountCodeSchema } from "./discountCodeSchema.js";

export const orderSchema = z.object({
  sumAmount: z.coerce.number().int().min(0),
  totalAmount: z.coerce.number().int().min(0),
  shippingAddress: shippingAddressSchema,
  discountCode: discountCodeSchema.pick({ code: true }),
  orderItems: z.object({
    quantity: z.coerce.number().int().min(0),
    unitPrice: z.coerce.number().int().min(0),
    sumAmount: z.coerce.number().int().min(0),
    variantId: z.string().trim().nonempty(),
    productSlug: z.string().trim().nonempty(),
    productName: z.string().trim().nonempty(),
    variantName: z.string().trim().nonempty(),
  }),
});

export const orderStatusSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "DELIVERING", "DELIVERED", "CANCELLED"]),
});
