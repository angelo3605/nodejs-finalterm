import { getDashboardDataService } from "../services/dashboardService.js";

export const getDashboardData = async (req, res) => {
  const data = await getDashboardDataService();
  return res.json({ data });
};
