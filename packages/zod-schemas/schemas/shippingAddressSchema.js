import z from "zod";

export const shippingAddressSchema = z.object({
  fullName: z.string().trim().nonempty(),
  address: z.string().trim().nonempty(),
  phoneNumber: z.preprocess((value) => (typeof value === "string" ? val.replace(/ +/g, "") : value), z.e164()),
});
