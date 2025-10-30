import bcrypt from "bcryptjs";
import prisma from "../prisma/client.js";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import redis from "../utils/redis.js";
import { getEmailTemplate, transporter } from "../utils/mailer.js";
import { updateUserService } from "./userService.js";

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

export const forgotService = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    throw new Error("User not found. Check your email!");
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "15min" });

  transporter.sendMail({
    from: '"Mint Boutique" <no-reply@mint.boutique>',
    to: user.email,
    subject: "Your Mint Boutique account is ready",
    html: await getEmailTemplate("resetPassword", {
      fullName: user.fullName,
      resetUrl: `${process.env.STORE_URL}/reset?token=${token}`,
    }),
  });
};

export const resetService = async (token, password) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  await updateUserService(decoded.id, { password });
};
