import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/roleMiddleware.js";
import { getDashboardData } from "../controllers/dashboardController.js";

const dashboardRouter = new Router();

dashboardRouter.use(requireAuth, checkRole("ADMIN"));

dashboardRouter.get("/", getDashboardData);

export default dashboardRouter;
