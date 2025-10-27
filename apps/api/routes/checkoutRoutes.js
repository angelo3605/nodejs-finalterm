import { Router } from "express";
import { optionalAuth } from "../middlewares/authMiddleware.js";
import { checkout, guestCheckout } from "../controllers/checkoutController.js";

const checkoutRouter = new Router();

checkoutRouter.use(optionalAuth);

checkoutRouter.post("/", (req, res) => {
  if (req.user) {
    return checkout(req, res);
  }
  return guestCheckout(req, res);
});

export default checkoutRouter;
