import prisma from "../prisma/client.js";


export const createDiscountCodeService = async (data) => {
  const existing = await prisma.discountCode.findUnique({
    where: { code: data.code },
  });

  if (existing) {
    throw new Error("Discount code already exists");
  }

  const discount = await prisma.discountCode.create({
    data,
  });

  return discount;
};

export const getDiscountCodeDetailsService = async (code) => {
  const discount = await prisma.discountCode.findUnique({
    where: { code },
  });

  if (!discount) {
    throw new Error("Discount code not found");
  }

  return discount;
};

export const getAllDiscountCodesService = async () => {
  return await prisma.discountCode.findMany({
    where: { isDeleted: false }, // Giả sử có cờ isDeleted
  });
};

export const getDeletedDiscountCodesService = async () => {
  return await prisma.discountCode.findMany({
    where: { isDeleted: true },
  });
};

export const updateDiscountCodeService = async (code, data) => {
  const exists = await prisma.discountCode.findUnique({
    where: { code },
  });

  if (!exists) {
    throw new Error("Discount code not found");
  }

  const discount = await prisma.discountCode.update({
    where: { code },
    data,
  });

  return discount;
};
