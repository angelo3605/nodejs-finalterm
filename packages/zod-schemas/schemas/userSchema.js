import { z } from "zod";

export const userSchema = z.object({
  fullName: z.string().trim().nonempty(),
  email: z.email().trim().nonempty(),
  password: z.string().min(6),
  role: z.enum(["CUSTOMER", "ADMIN"]),
  loyaltyPoints: z.coerce.number().int().min(0),
});

export const registerSchema = userSchema.pick({
  fullName: true,
  email: true,
  password: true,
});

export const loginSchema = userSchema
  .pick({
    email: true,
    password: true,
  })
  .extend({
    rememberMe: z.coerce.boolean().default(false),
  });

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});
