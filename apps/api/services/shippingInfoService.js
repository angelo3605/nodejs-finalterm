import prisma from "../prisma/prismaClient.js";

export const getAllShippingInfoService = async (userId) => {
  try {
    const infos = await prisma.shippingAddress.findMany({
      where: { userId },
      orderBy: { isDefault: "desc" },
    });
    return infos;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createShippingAddressService = async (userId, fullName, address, phoneNumber) => {
  try {
    if (!userId) {
      throw new Error("userId is required");
    }
    const isDuplicate = await prisma.shippingAddress.findFirst({
      where: {
        userId,
        address,
        phoneNumber,
        fullName,
      },
    });

    if (isDuplicate) {
      throw new Error("Địa chỉ đã tồn tại.");
    }

    const existingAddresses = await prisma.shippingAddress.findMany({
      where: { userId },
    });

    const isDefault = existingAddresses.length === 0;

    const newShippingAddress = await prisma.shippingAddress.create({
      data: {
        userId,
        fullName,
        address,
        phoneNumber,
        isDefault,
      },
    });

    return newShippingAddress;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const changeIsDefaultService = async (userId, infoShippingId) => {
  try {
    const existing = await prisma.shippingAddress.findFirst({
      where: { userId, id: infoShippingId },
    });
    if (!existing) throw new Error("Địa chỉ không hợp lệ.");

    await prisma.shippingAddress.updateMany({
      where: {
        userId,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });
    const defaultInfo = await prisma.shippingAddress.update({
      where: { id: infoShippingId },
      data: { isDefault: true },
    });

    return defaultInfo;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteShippingInfoService = async (userId, infoShippingId) => {
  try {
    const existing = await prisma.shippingAddress.findFirst({
      where: { userId, id: infoShippingId },
    });

    if (!existing) throw new Error("Không tìm thấy địa chỉ.");

    await prisma.shippingAddress.delete({ where: { id: infoShippingId } });

    if (existing.isDefault) {
      const latest = await prisma.shippingAddress.findFirst({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      });

      if (latest) {
        await prisma.shippingAddress.update({
          where: { id: latest.id },
          data: { isDefault: true },
        });
      }
    }

    return existing;
  } catch (error) {
    throw new Error(error.message);
  }
};
