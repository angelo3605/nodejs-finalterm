import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(1).trim(),
  email: z.string().min(1).trim(),
  password: z.string().min(1),
});
