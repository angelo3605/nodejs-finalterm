import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/roleMiddleware.js";
import { getAllOrders, getMyOrders } from "../controllers/orderController.js";

const orderRouter = new Router();

orderRouter.use(requireAuth);

orderRouter.get("/", checkRole("ADMIN"), getAllOrders);
orderRouter.get("/me", getMyOrders);

export default orderRouter;
