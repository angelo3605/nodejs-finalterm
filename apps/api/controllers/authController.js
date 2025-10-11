import { registerUser, signToken, revokeToken } from "../services/authService.js";
import jwt from "jsonwebtoken";

export const issueToken = (req, res) => {
  const { rememberMe } = req.body ?? {};

  const expiresIn = rememberMe ? "7d" : "1h";
  const token = signToken(req.user, expiresIn);

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
  try {
    const { email, password, fullName } = req.body;
    await registerUser(email, password, fullName);

    next();
  } catch (err) {
    return res.status(400).json({
      message: err.message || "Register failed",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (token) {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      await revokeToken(payload.jti, payload.exp);
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Something went wrong",
    });
  }
};
