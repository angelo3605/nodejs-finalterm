import express from "express";
import { addToCart, updateCart, removeFromCart, getCartSummary } from "../controllers/cartController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const cartRoutes = express.Router();
cartRoutes.use(requireAuth);

cartRoutes.post("/", addToCart);
cartRoutes.put("/", updateCart);
cartRoutes.delete("/:cartItemId", removeFromCart);
cartRoutes.get("/summary", getCartSummary);

export default cartRoutes;
