import { z } from "zod";

export const dashboardSchema = z.object({
  interval: z.enum(["year", "quarter", "month", "week", "custom"]).default("year"),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});