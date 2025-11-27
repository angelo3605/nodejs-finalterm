import z from "zod";

export const phoneNumberSchema = z
  .string()
  .trim()
  .regex(/^(\+84|0)(3|5|7|8|9)\d{8}$/, { message: "Invalid phone number" })
  .transform((v) => v.replace("+84", "0"));

export const shippingAddressSchema = z.object({
  fullName: z.string().trim().nonempty(),
  address: z.string().trim().nonempty(),
  province: z.string().trim().nonempty(),
  district: z.string().trim().nonempty(),
  ward: z.string().trim().optional(),
  phoneNumber: phoneNumberSchema,
  isDefault: z.coerce.boolean().default(false),
});
