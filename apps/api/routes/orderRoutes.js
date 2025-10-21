import { Router } from "express";
import { checkout, getAllOrder, getDetailOrder } from "../controllers/orderController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const orderRouter = Router();

orderRouter.use(requireAuth);

orderRouter.get("/", getAllOrder);

orderRouter.post("/checkout", checkout);

orderRouter.get("/:orderId", getDetailOrder);

export default orderRouter;
