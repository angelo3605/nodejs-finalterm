import express from "express";
import { checkout, getAllOrder, getDetailOrder } from "../controllers/orderController.js";
import { passport } from "../utils/passport.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const orderRoutes = express.Router();
// orderRoutes.use(requireAuth);

orderRoutes.get("/", requireAuth, getAllOrder);
orderRoutes.post("/checkout", checkout);
orderRoutes.post("/detail/:orderId", requireAuth, getDetailOrder);

export default orderRoutes;
