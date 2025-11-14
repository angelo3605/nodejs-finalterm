import { Router } from "express";
import { changeMyPassword, getMe, updateMyInfo } from "../controllers/profileController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/zodMiddleware.js";
import { changePasswordSchema, registerSchema } from "@mint-boutique/zod-schemas";

const profileRouter = new Router();

profileRouter.use(requireAuth);

profileRouter.get("/", getMe);
profileRouter.patch("/", validate(registerSchema.omit({ password: true }).partial()), updateMyInfo);
profileRouter.post("/change-password", validate(changePasswordSchema), changeMyPassword);

export default profileRouter;
