import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/roleMiddleware.js";
import { getAllOrders, getMyOrders, updateOrderStatus } from "../controllers/orderController.js";

const orderRouter = new Router();

orderRouter.use(requireAuth);

orderRouter.get("/me", getMyOrders);
orderRouter.get("/", checkRole("ADMIN"), getAllOrders);
orderRouter.patch("/:id", checkRole("ADMIN"), updateOrderStatus);

export default orderRouter;
