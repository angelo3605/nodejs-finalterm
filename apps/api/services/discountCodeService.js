import prisma from "../prisma/client.js";

export const createDiscountCodeService = async (data) => {
  return prisma.discountCode.create({
    data,
  });
};

export const getDiscountCodeByCodeService = async (code) => {
  return prisma.discountCode.findUnique({
    where: { code },
  });
};

export const updateDiscountCodeService = async (code, data) => {
  return prisma.discountCode.update({
    where: { code },
    data,
  });
};

export const getAllDiscountCodesService = async ({ page, pageSize }) => {
  const [total, data] = await Promise.all([
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
  return prisma.discountCode.findMany({
    where: { isDeleted: true },
  });
};
