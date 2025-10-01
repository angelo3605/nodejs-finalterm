import bcrypt from "bcryptjs";
import prisma from "../prisma/prismaClient.js";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

export const signTokensService = ({ id, role }) => {
  return {
    refreshToken: jwt.sign({ jti: nanoid(), sub: id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "15m" }),
    accessToken: jwt.sign({ sub: id, role }, process.env.JWT_SECRET, { expiresIn: "7d" }),
  };
};

export const registerService = async (email, password, fullName) => {
  if (await prisma.user.findUnique({ where: { email } })) {
    throw new Error("Email already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  return await prisma.user.create({
    data: { email, password: hashedPassword, fullName },
  });
};

export const refreshService = async (oldRefreshToken) => {
  if (!oldRefreshToken) {
    throw new Error("No token provided");
  }

  console.log(oldRefreshToken);

  const { sub } = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
  const user = await prisma.user.findUnique({ where: { id: sub } });
  if (!user) {
    throw new Error("Invalid token");
  }

  return signTokensService(user);
};

export const logoutService = async (refreshToken) => {
  const { jti } = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  await prisma.revokedToken.create({ data: { jti } });
};
