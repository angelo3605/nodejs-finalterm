import prisma from "../prisma/client.js";

export const getAllShippingAddressesService = async ({ userId }) => {
  return await prisma.shippingAddress.findMany({
    where: { userId },
    orderBy: { isDefault: "desc" },
  });
};

export const getShippingAddressByIdService = async (id, { userId }) => {
  return await prisma.shippingAddress.findUnique({
    where: {
      id_userId: { id, userId },
    },
  });
};

export const createShippingAddressService = async ({ userId }, data) => {
  const isFirst = !(await prisma.shippingAddress.findFirst({
    where: { userId },
  }));
  const shippingAddress = await prisma.shippingAddress.create({
    data: {
      ...data,
      userId,
      isDefault: data.isDefault || isFirst,
    },
  });
  if (data.isDefault) {
    await prisma.shippingAddress.updateMany({
      where: {
        userId,
        isDefault: true,
        NOT: { id: shippingAddress.id },
      },
      data: { isDefault: false },
    });
  }
  return shippingAddress;
};

export const updateShippingAddressService = async (id, { userId }, data) => {
  const shippingAddress = await prisma.shippingAddress.update({
    where: {
      id_userId: { id, userId },
    },
    data,
  });
  if (data.isDefault) {
    await prisma.shippingAddress.updateMany({
      where: {
        userId,
        isDefault: true,
        NOT: { id },
      },
      data: { isDefault: false },
    });
  }
  return shippingAddress;
};

export const deleteShippingAddressService = async (id, { userId }) => {
  const shippingAddress = await prisma.shippingAddress.delete({
    where: {
      id_userId: { id, userId },
    },
  });
  if (shippingAddress.isDefault) {
    const latest = await prisma.shippingAddress.findFirst({
      where: {
        userId,
        isDefault: false,
        NOT: { id },
      },
      orderBy: { updatedAt: "desc" },
    });
    await prisma.shippingAddress.update({
      where: { id: latest.id },
      data: { isDefault: true },
    });
  }
  return shippingAddress;
};
