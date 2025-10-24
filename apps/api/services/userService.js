import prisma from "../prisma/client.js";
import bcrypt from "bcryptjs";

const userSelect = {
  id: true,
  fullName: true,
  email: true,
  role: true,
  loyaltyPoints: true,
  createdAt: true,
};

export const getUserByIdService = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: userSelect,
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const updateUserService = async (id, { fullName, email, password, role, loyaltyPoints }) => {
  if (
    !(await prisma.user.findUnique({
      where: { id },
    }))
  ) {
    throw new Error("User not found");
  }
  return await prisma.user.update({
    where: { id },
    data: {
      fullName,
      email,
      password: await bcrypt.hash(password, 10),
      role,
      loyaltyPoints,
    },
  });
};
