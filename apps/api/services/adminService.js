import { tr } from "zod/v4/locales";
import prisma from "../prisma/prismaClient.js";

// Lấy tất cả người dùng
export const getAllUsers = async () => {
  try {
    const listUser = await prisma.user.findMany({
      select: {
        fullName: true,
        role: true,
        email: true,
      },
    });
    return listUser;
  } catch (error) {
    throw new Error("Cant load user", error.message);
  }
};

export const blockedOrUnblockedService = async (userId, role) => {
  try {
    const changeRole = await prisma.user.update({
      where: { id: userId },
      data: {
        role,
      },
    });
    return changeRole;
  } catch (error) {
    throw new Error("Cant change role", error.message);
  }
};

export const updateUser = async (userId, userData) => {
  const { fullName, email } = userData;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName,
        email,
      },
    });

    return updatedUser;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAllOrders = async () => {
  try {
    const listOrders = await prisma.order.findMany({
      select: {
        id: true,
        status: true,
        totalAmount: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return listOrders;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const changeStatusOrder = async (orderId, status) => {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
      },
    });
    return order;
  } catch (error) {
    throw new Error(error.message);
  }
};
