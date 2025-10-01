import { Router } from "express";
import { passport } from "../utils/passport.js";
import prisma from "../prisma/prismaClient.js";
import jwt from "jsonwebtoken";

export const requireAuth = new Router();

requireAuth.use(passport.authenticate("jwt", { session: false }), async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const { jti } = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  if (!jti || (await prisma.revokedToken.findUnique({ where: { jti } }))) {
    return res.status(401).json({ message: "Not logged in" });
  }
  next();
});
