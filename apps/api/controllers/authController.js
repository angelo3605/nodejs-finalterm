import { registerService, signTokenService, logoutService } from "../services/authService.js";
import jwt from "jsonwebtoken";

export const issueToken = (req, res) => {
  const { rememberMe } = req.body ?? {};

  const expiresIn = rememberMe ? "7d" : "1h";
  const token = signTokenService(req.user, expiresIn);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000 * (rememberMe ? 24 * 7 : 1),
  });
  return res.json({
    message: "Login successfully",
  });
};

export const register = async (req, res, next) => {
  const { email, password, fullName } = req.body;
  await registerService(email, password, fullName);

  next();
};

export const logout = async (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    await logoutService(payload.jti, payload.exp);
  }

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return res.json({
    message: "Logout successfully",
  });
};
