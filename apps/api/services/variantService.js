import prisma from "../prisma/prismaClient.js";

export const addVariantService = async (name, price, stockQuantity, productId) => {
    try {
        const newVariant = await prisma.productVariant.create({
            data: {
                name,
                price,
                stockQuantity,
                product: {
                    connect: { id: productId },
                },
            },
        });

        return newVariant;
    } catch (error) {
        throw new Error(error.message);
    }
};


export const updateVariantService = async (variantId, name, price, stockQuantity) => {
    try {
        const updatedVariant = await prisma.productVariant.update({
            where: { id: variantId },
            data: {
                name,
                price,
                stockQuantity,
            },
        });

        return updatedVariant;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const deleteVariantService = async (variantId) => {
    try {
        const deletedVariant = await prisma.productVariant.update({
            where: { id: variantId },
            data: {
                isDeleted: true,
            },
        });

        return deletedVariant;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const restoreVariantService = async (variantId) => {
    try {
        const restoredVariant = await prisma.productVariant.update({
            where: { id: variantId },
            data: {
                isDeleted: false,
            },
        });

        return restoredVariant;
    } catch (error) {
        throw new Error(error.message);
    }
};

//  này all nha ( mấy cái kia cho admin thôi)
export const getVariantsByProductService = async (productId) => {
    try {
        const variants = await prisma.productVariant.findMany({
            where: { productId },
        });

        return variants;
    } catch (error) {
        throw new Error(error.message);
    }
};