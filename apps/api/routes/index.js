import { Router } from "express";

import { requireAuth } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/roleMiddleware.js";
import { handleError } from "../middlewares/errorMiddleware.js";
import authRouter from "./authRoutes.js";
import imageRouter from "./imageRoutes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/images", imageRouter);

router.get("/", requireAuth, checkRole("ADMIN"), (req, res) => {
  res.send("Hello, World!");
});

router.use(handleError);

export default router;
