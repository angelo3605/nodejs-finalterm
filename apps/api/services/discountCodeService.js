import prisma from "../prisma/prismaClient.js";

export const createDiscountCodeService = async (code, desc, type, value, usageLimit) => {
  try {
    const discount = await prisma.discountCode.create({
      data: {
        code,
        desc,
        type,
        value,
        usageLimit,
      },
    });

    return discount;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getDiscountDetailsService = async (code) => {
  try {
    const discount = await prisma.discountCode.findUnique({
      where: { code: code },
    });

    if (!discount) {
      throw new Error("Mã giảm giá không hợp lệ");
    }

    if (discount.numOfUsage >= discount.usageLimit) {
      throw new Error("Mã giảm giá đã hết lượt sử dụng");
    }

    return discount;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAllDiscountCodeService = async () => {
  try {
    const discounts = await prisma.discountCode.findMany({});
    return discounts;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getDetailDiscountCodeService = async (code) => {
  try {
    const discount = await prisma.discountCode.findUnique({ where: { code } });
    return discount;
  } catch (error) {
    throw new Error(error.message);
  }
};
