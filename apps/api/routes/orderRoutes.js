import express from "express";
import { checkout, getAllOrder, getDetailOrder } from "../controllers/orderController.js";
import { passport } from "../utils/passport.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { extractUserId } from "../middleware/middleware.js";

const orderRoutes = express.Router();
// orderRoutes.use(requireAuth);

orderRoutes.get("/", requireAuth, getAllOrder);
orderRoutes.post("/checkout",extractUserId ,checkout);
orderRoutes.post("/detail/:orderId", requireAuth, getDetailOrder);

export default orderRoutes;
