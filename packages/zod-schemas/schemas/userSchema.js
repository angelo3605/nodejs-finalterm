import { z } from "zod";

const passwordSchema = z.string().min(6);

export const userSchema = z.object({
  fullName: z.string().trim().nonempty(),
  email: z.email().trim().nonempty(),
  password: passwordSchema,
  role: z.enum(["CUSTOMER", "ADMIN", "BLOCKED"]),
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

export const forgotSchema = userSchema.pick({
  email: true,
});

export const resetSchema = z.object({
  token: z.string().trim().nonempty(),
  password: passwordSchema,
});

export const changePasswordSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
});
