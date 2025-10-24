import prisma from "../prisma/client.js";

export const getShippingAddressesByUserService = async (userId) => {
  return await prisma.shippingAddress.findMany({
    where: { userId },
    orderBy: { isDefault: "desc" },
  });
};

export const addShippingAddressService = async (userId, fullName, address, phoneNumber) => {
  const isDuplicate = await prisma.shippingAddress.findFirst({
    where: { userId, fullName, address, phoneNumber },
  });

  if (isDuplicate) throw new Error("Shipping address already exists");

  const existingAddresses = await prisma.shippingAddress.findMany({ where: { userId } });
  const isDefault = existingAddresses.length === 0;

  return await prisma.shippingAddress.create({
    data: { userId, fullName, address, phoneNumber, isDefault },
  });
};

export const setDefaultShippingAddressService = async (userId, infoShippingId) => {
  const existing = await prisma.shippingAddress.findFirst({ where: { userId, id: infoShippingId } });
  if (!existing) throw new Error("Địa chỉ không hợp lệ.");

  await prisma.shippingAddress.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } });
  return await prisma.shippingAddress.update({ where: { id: infoShippingId }, data: { isDefault: true } });
};

export const deleteShippingAddressService = async (userId, infoShippingId) => {
  const existing = await prisma.shippingAddress.findFirst({ where: { userId, id: infoShippingId } });
  if (!existing) throw new Error("Cannot find shipping address");

  await prisma.shippingAddress.delete({ where: { id: infoShippingId } });

  if (existing.isDefault) {
    const latest = await prisma.shippingAddress.findFirst({ where: { userId }, orderBy: { updatedAt: "desc" } });
    if (latest) await prisma.shippingAddress.update({ where: { id: latest.id }, data: { isDefault: true } });
  }

  return existing;
};
