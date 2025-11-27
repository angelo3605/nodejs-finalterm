import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/roleMiddleware.js";
import { getAllOrders, getMyOrders, getOrderById, updateOrderStatus } from "../controllers/orderController.js";
import { validate } from "../middlewares/zodMiddleware.js";
import { orderStatusSchema } from "@mint-boutique/zod-schemas";

const orderRouter = new Router();

orderRouter.use(requireAuth);

orderRouter.get("/me", getMyOrders);
orderRouter.get("/:id", getOrderById);
orderRouter.get("/", checkRole("ADMIN"), getAllOrders);
orderRouter.patch("/:id", checkRole("ADMIN"), validate(orderStatusSchema), updateOrderStatus);

export default orderRouter;
