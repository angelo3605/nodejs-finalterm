import prisma from "../prisma/prismaClient.js";

export const getDiscountDetailsService = async (code) => {
    try {
        const discount = await prisma.discountCode.findUnique({
            where: { code: code }
        });

        if (!discount) {
            throw new Error('Mã giảm giá không hợp lệ');
        }

        if (discount.numOfUsage >= discount.usageLimit) {
            throw new Error('Mã giảm giá đã hết lượt sử dụng');
        }

        return discount;
    } catch (error) {
        throw new Error(error.message);
    }
};
