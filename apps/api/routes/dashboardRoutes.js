import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/roleMiddleware.js";
import { getChartStats, getOrderStatuses, getSummary } from "../controllers/dashboardController.js";

const dashboardRouter = new Router();

dashboardRouter.use(requireAuth, checkRole("ADMIN"));

dashboardRouter.get("/summary", getSummary);
dashboardRouter.get("/chart", getChartStats);
dashboardRouter.get("/order-statuses", getOrderStatuses);

export default dashboardRouter;
