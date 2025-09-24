import express from "express";
import { addToCart, updateCart, removeFromCart, getCartSummary } from "../controllers/cartController.js";
import { passport } from "../utils/passport.js";

const cartRoutes = express.Router();
cartRoutes.use(passport.authenticate("jwt", { session: false }));

cartRoutes.post("/", addToCart);
cartRoutes.put("/", updateCart);
cartRoutes.delete("/:cartItemId", removeFromCart);
cartRoutes.get("/summary", getCartSummary);

export default cartRoutes;
