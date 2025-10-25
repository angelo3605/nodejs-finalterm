import { Router } from "express";
import { optionalAuth } from "../middlewares/authMiddleware.js";
import { addOrSubtractToCart, getCart } from "../controllers/cartController.js";
import { validate } from "../middlewares/zodMiddleware.js";
import { cartSchema } from "@mint-boutique/zod-schemas";

const cartRouter = new Router();

cartRouter.use(optionalAuth);

cartRouter.get("/", getCart);
cartRouter.post("/", validate(cartSchema), addOrSubtractToCart);

export default cartRouter;
