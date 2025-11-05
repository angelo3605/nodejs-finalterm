import { z } from "zod";

export const dashboardChartSchema = z.object({
  interval: z.enum(["year", "quarter", "month", "week", "day"]).default("month"),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  groupBy: z.enum(["product", "category"]).default("category"),
});
