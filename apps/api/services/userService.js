import prisma from "../prisma/client.js";

const userSelect = {
  id: true,
  fullName: true,
  email: true,
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
