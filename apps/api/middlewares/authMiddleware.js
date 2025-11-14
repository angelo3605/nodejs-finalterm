import { Router } from "express";
import passport from "../utils/passport.js";
import jwt from "jsonwebtoken";
import extractToken from "../utils/extractToken.js";
import redis from "../utils/redis.js";

export const requireAuth = new Router();

requireAuth.use(passport.authenticate("jwt", { session: false }), async (req, res, next) => {
  const token = extractToken(req);
  const payload = jwt.verify(token, process.env.JWT_SECRET);

  if (await redis.exists(`revoked:${payload.jti}`)) {
    return res.status(401).json({
      message: "Not logged in",
    });
  }

  next();
});

export const optionalAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);
};
