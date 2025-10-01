import { Router } from "express";
import { passport } from "../utils/passport.js";
import { registerSchema } from "../schemas/userSchema.js";
import { validate } from "../middleware/zodMiddleware.js";
import { issueTokens, localLogin, logout, oauthLogin, refresh, register } from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/refresh", refresh, issueTokens);

authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/login", localLogin, issueTokens);

authRouter.post("/logout", logout);

authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
authRouter.get("/google/callback", passport.authenticate("google", { session: false }), oauthLogin, issueTokens);

authRouter.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
authRouter.get("/facebook/callback", passport.authenticate("facebook", { session: false }), oauthLogin, issueTokens);

export default authRouter;
