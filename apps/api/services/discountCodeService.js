import prisma from "../prisma/client.js";

export const createDiscountCodeService = async (data) => {
  return await prisma.discountCode.create({
    data,
  });
};

export const getDiscountCodeByCodeService = async (code) => {
  return await prisma.discountCode.findUnique({
    where: { code },
  });
};

export const updateDiscountCodeService = async (code, data) => {
  return await prisma.discountCode.update({
    where: { code },
    data,
  });
};

export const getAllDiscountCodesService = async ({ page, pageSize }) => {
  const [data, total] = await Promise.all([
    prisma.discountCode.count({
      where: { isDeleted: false },
    }),
    prisma.discountCode.findMany({
      where: { isDeleted: false },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);
  return { data, total };
};

export const getDeletedDiscountCodeService = async () => {
  return await prisma.discountCode.findMany({
    where: { isDeleted: true },
  });
};
