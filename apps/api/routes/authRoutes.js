import { Router } from "express";

import passport from "../utils/passport.js";
import { registerSchema } from "@mint-boutique/zod-schemas";
import { validate } from "../middlewares/zodMiddleware.js";
import { issueToken, logout, register } from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/register", validate(registerSchema), register, passport.authenticate("local", { session: false }), issueToken);
authRouter.post("/login", passport.authenticate("local", { session: false }), issueToken);
authRouter.post("/logout", logout);

authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
authRouter.get("/google/callback", passport.authenticate("google", { session: false }), issueToken);

authRouter.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
authRouter.get("/facebook/callback", passport.authenticate("facebook", { session: false }), issueToken);

export default authRouter;
