import { passport } from "../utils/passport.js";
import { logoutService, refreshService, registerService, signTokensService } from "../services/authService.js";

export const issueTokens = async (req, res) => {
  const { accessToken, refreshToken } = res.locals;
  if (!accessToken || !refreshToken) {
    return res.status(500).json({ message: "Tokens not prepared" });
  }

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.json({ accessToken });
};

export const register = async (req, res, next) => {
  try {
    const { email, password, fullName } = req.body;
    const user = await registerService(email, password, fullName);
    Object.assign(res.locals, { user, ...signTokensService(user) });
    next();
  } catch (error) {
    return res.status(400).json({ message: error.message || "Registration failed" });
  }
};

export const localLogin = (req, res, next) => {
  return passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json(info || { message: "Login failed" });
    }
    Object.assign(res.locals, { user, ...signTokensService(user) });
    next();
  })(req, res, next);
};

export const oauthLogin = async (req, res, next) => {
  Object.assign(res.locals, { user: req.user, ...signTokensService(req.user) });
  next();
};

export const refresh = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies?.refreshToken;
    Object.assign(res.locals, { ...(await refreshService(oldRefreshToken)) });
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Not logged in" });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    await logoutService(refreshToken);
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    return res.json({ message: "Logout successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message || "Logout failed" });
  }
};
