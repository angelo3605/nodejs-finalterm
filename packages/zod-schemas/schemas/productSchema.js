import { z } from "zod";

const optionalString = z
  .string()
  .trim()
  .nonempty()
  .nullable()
  .transform((value) => value || undefined)
  .optional();

export const productSchema = z.object({
  name: z.string().trim().nonempty(),
  desc: z.string().trim().optional(),
  imageUrls: z.array(z.string().trim()).optional(),
  brand: optionalString,
  category: optionalString,
  isFeatured: z.coerce.boolean().default(false),
});

export const productSortingSchema = z
  .object({
    sortBy: z.enum(["name", "price", "createdAt", "updatedAt", "mostOrders"]),
    sortInAsc: z.coerce.number().int().min(0).max(1).transform(Boolean).default(false),
  })
  .partial();

export const productFilteringSchema = z
  .object({
    isFeatured: z.coerce.number().int().min(0).max(1).transform(Boolean).default(false),
    name: z.string().nonempty().trim(),
    minPrice: z.coerce.number().min(0),
    maxPrice: z.coerce.number().min(0),
    category: z.string().trim().nonempty(),
    brands: z.string().transform((value) => (value ? value.replace(/ /g, "").split(",") : [])),
    isDeleted: z.coerce.number().int().min(0).max(1).transform(Boolean).default(false),
  })
  .partial();
