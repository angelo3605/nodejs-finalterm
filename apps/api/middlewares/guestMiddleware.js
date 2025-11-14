import { nanoid } from "nanoid";

export const createGuestSession = (req, res, next) => {
  let guestId = req.cookies.guestId;
  if (!guestId) {
    guestId = nanoid();
    res.cookie("guestId", guestId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
  }
  req.guestId = guestId;
  next();
};
