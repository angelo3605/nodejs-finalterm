import { Router } from "express";
import { validate } from "../middlewares/zodMiddleware.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/roleMiddleware.js";
import { getAllUsers, updateUser } from "../controllers/userController.js";
import { userSchema } from "@mint-boutique/zod-schemas";

const userRouter = new Router();

userRouter.use(requireAuth, checkRole("ADMIN"));

userRouter.get("/", getAllUsers);
userRouter.patch("/:id", validate(userSchema.partial()), updateUser);

export default userRouter;
