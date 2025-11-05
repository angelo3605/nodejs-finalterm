import { dashboardChartSchema } from "@mint-boutique/zod-schemas";
import { getChartStatsService, getOrderStatusesService } from "../services/dashboardService.js";

export const getChartStats = async (req, res) => {
  const options = dashboardChartSchema.parse(req.query);

  const data = await getChartStatsService(options);
  return res.json({ data });
};

export const getOrderStatuses = async (req, res) => {
  const data = await getOrderStatusesService();
  return res.json({ data });
};
