import z from "zod";

export const shippingAddressSchema = z.object({
  fullName: z.string().trim().nonempty(),
  address: z.string().trim().nonempty(),
  province: z.string().trim().nonempty(),
  district: z.string().trim().nonempty(),
  ward: z.string().trim().optional(),
  phoneNumber: z.string().trim().nonempty(),
  isDefault: z.coerce.boolean().default(false),
});
