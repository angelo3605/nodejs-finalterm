import express from "express";
const router = express.Router();
import authRouter from "./authRoutes.js";
import userRouter from "./userRoutes.js";
import adminRouter from "./adminRoutes.js";
import cartRoutes from "./cartRoutes.js";
import orderRoutes from "./orderRoutes.js";
import discountRoutes from "./discountRoutes.js";
import brandRouter from "./brandRoutes.js";
import categoryRouter from "./categoryRoutes.js";
import { passport } from "../utils/passport.js";
import checkAdmin from "../middleware/adminMiddleware.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import shippingInfoRouter from "./shippingInfoRoutes.js";
import productRouter from "./productRoutes.js";
import commentRoutes from "./commentRoutes.js";
import ratingRoutes from "./ratingRoutes.js";
import paymentRoutes from "./paymentRoutes.js";


// router -> controller -> service

router.get("/", (req, res) => {
  res.send("Hello, World!");
});

router.use("/admin", requireAuth, checkAdmin, adminRouter);
router.use("/brand", brandRouter);
router.use("/category", categoryRouter);
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/cart", cartRoutes);
router.use("/order", orderRoutes);
router.use("/discount", discountRoutes);
router.use("/shipping", shippingInfoRouter);
router.use("/product", productRouter);
router.use("/comments", commentRoutes);
router.use("/ratings", ratingRoutes);
router.use("/payment", paymentRoutes );

export default router;
