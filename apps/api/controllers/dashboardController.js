import { getDashboardDataService } from "../services/dashboardService.js";
import { dashboardSchema } from "@mint-boutique/zod-schemas";

export const getDashboardData = async (req, res) => {
  const options = dashboardSchema.parse(req.query);

  const data = await getDashboardDataService(options);
  return res.json({ data });
};
