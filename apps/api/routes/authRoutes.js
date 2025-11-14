import { Router } from "express";

import passport from "../utils/passport.js";
import { forgotSchema, registerSchema, resetSchema } from "@mint-boutique/zod-schemas";
import { validate } from "../middlewares/zodMiddleware.js";
import { forgot, issueToken, logout, register, reset } from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/register", validate(registerSchema), register, passport.authenticate("local", { session: false }), issueToken);
authRouter.post("/login", passport.authenticate("local", { session: false }), issueToken);
authRouter.post("/logout", logout);

authRouter.get("/google", (req, res, next) =>
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: req.query?.redirectTo || "store",
  })(req, res, next),
);
authRouter.get("/google/callback", passport.authenticate("google", { session: false }), issueToken);

authRouter.get("/facebook", (req, res, next) =>
  passport.authenticate("facebook", {
    scope: ["email"],
    state: req.query?.redirectTo || "store",
  })(req, res, next),
);
authRouter.get("/facebook/callback", passport.authenticate("facebook", { session: false }), issueToken);

authRouter.post("/forgot", validate(forgotSchema), forgot);
authRouter.post("/reset", validate(resetSchema), reset);

export default authRouter;
