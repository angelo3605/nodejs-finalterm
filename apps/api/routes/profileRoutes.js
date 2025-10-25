import { Router } from "express";
import { getMe } from "../controllers/profileController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const profileRouter = new Router();

profileRouter.use(requireAuth);

profileRouter.get("/", getMe);

export default profileRouter;
