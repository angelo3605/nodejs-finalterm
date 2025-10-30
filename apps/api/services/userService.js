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

export const getAllUsersService = async ({ excludeIds }, { page, pageSize }) => {
  const where = {
    id: excludeIds?.length ? { notIn: excludeIds } : undefined,
  };
  const [total, data] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);
  return { data, total };
};

export const getUserByIdService = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    select: userSelect,
  });
};

export const updateUserService = async (id, data) => {
  const password = data.password ? await bcrypt.hash(data.password, 10) : undefined;
  return await prisma.user.update({
    where: { id },
    data: {
      ...data,
      password,
    },
  });
};
