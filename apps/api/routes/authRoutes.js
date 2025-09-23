import express from "express";
import { login, refresh, register } from "../controllers/authController.js";
import { passport, issueTokens } from "../utils/passport.js";
import { validate } from "../middleware/zodMiddleware.js";
import { registerSchema } from "../schemas/userSchema.js";

const authRouter = express.Router();

authRouter.post("/refresh", refresh);

authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/login", login);

authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
authRouter.get("/google/callback", passport.authenticate("google", { session: false }), (req, res) => {
  return issueTokens(res, req.user.id);
});

authRouter.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
authRouter.get("/facebook/callback", passport.authenticate("facebook", { session: false }), (req, res) => {
  return issueTokens(res, req.user.id);
});

export default authRouter;
