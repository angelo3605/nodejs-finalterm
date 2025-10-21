import { getShopStatisticsService, getShopHighlightsService } from "../services/dashboardService.js";

export const getShopStatistics = async (req, res) => {
  try {
    const stats = await getShopStatisticsService();
    return res.json(stats);
  } catch (error) {
    console.error("Dashboard Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getShopHighlights = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid startDate or endDate" });
    }

    const highlights = await getShopHighlightsService(start, end);
    return res.json(highlights);
  } catch (error) {
    console.error("Dashboard Highlights Error:", error);
    return res.status(500).json({ message: error.message });
  }
};
