import { nanoid } from "nanoid";

export const setAnonymousId = (req, res, next) => {
  let anonymousId = req.cookies?.anonymousUserId;

  if (!anonymousId) {
    anonymousId = nanoid(); 
    res.cookie("anonymousUserId", anonymousId, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
  }

  req.anonymousUserId = anonymousId;
  next();
};