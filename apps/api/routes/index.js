import { Router } from "express";

import { requireAuth } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/roleMiddleware.js";
import { handleError } from "../middlewares/errorMiddleware.js";
import authRouter from "./authRoutes.js";
import imageRouter from "./imageRoutes.js";
import brandRouter from "./brandRoutes.js";
import categoryRouter from "./categoryRoutes.js";
import productRouter from "./productRoutes.js";
import profileRouter from "./profileRoutes.js";
import variantRouter from "./variantRoutes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/images", imageRouter);
router.use("/brands", brandRouter);
router.use("/categories", categoryRouter);
router.use("/products", productRouter);
router.use("/variants", variantRouter);
router.use("/profile", requireAuth, profileRouter);

router.get("/", requireAuth, checkRole("ADMIN"), (req, res) => {
  res.send("Hello, World!");
});

router.use(handleError);

export default router;
