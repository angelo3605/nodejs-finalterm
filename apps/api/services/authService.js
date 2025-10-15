import bcrypt from "bcryptjs";
import prisma from "../prisma/client.js";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import redis from "../utils/redis.js";

export const signTokenService = (user, expiresIn) =>
  jwt.sign(
    {
      jti: nanoid(),
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn },
  );

export const registerService = async (email, password, fullName) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (user) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  return await prisma.user.create({
    data: {
      email,
      fullName,
      password: hashedPassword,
    },
  });
};

export const logoutService = async (jti, exp) => {
  const now = Math.floor(Date.now() / 1000);
  const ttl = exp > now ? exp - now : 60;

  await redis.set(`revoked:${jti}`, "1", { EX: ttl });
};
