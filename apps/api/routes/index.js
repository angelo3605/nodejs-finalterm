import { Router } from "express";

import { handleError } from "../middlewares/errorMiddleware.js";
import { createGuestSession } from "../middlewares/guestMiddleware.js";
import authRouter from "./authRoutes.js";
import brandRouter from "./brandRoutes.js";
import cartRouter from "./cartRoutes.js";
import categoryRouter from "./categoryRoutes.js";
import checkoutRouter from "./checkoutRoutes.js";
import imageRouter from "./imageRoutes.js";
import productRouter from "./productRoutes.js";
import profileRouter from "./profileRoutes.js";
import variantRouter from "./variantRoutes.js";
import orderRouter from "./orderRoutes.js";
import shippingAddressRouter from "./shippingAddressRoutes.js";
import dashboardRouter from "./dashboardRoutes.js";
import commentRouter from "./commentRoutes.js";
import ratingRouter from "./ratingRoutes.js";
import vnpayRouter from "./vnpayRoutes.js";

const router = Router();

router.use(createGuestSession);

router.use("/auth", authRouter);
router.use("/images", imageRouter);
router.use("/brands", brandRouter);
router.use("/categories", categoryRouter);
router.use("/products", productRouter);
router.use("/variants", variantRouter);
router.use("/profile", profileRouter);
router.use("/cart", cartRouter);
router.use("/checkout", checkoutRouter);
router.use("/orders", orderRouter);
router.use("/profile/shipping-addresses", shippingAddressRouter);
router.use("/dashboard", dashboardRouter);
router.use(commentRouter);
router.use(ratingRouter);
router.use("/payment", vnpayRouter);

router.use(handleError);

export default router;
