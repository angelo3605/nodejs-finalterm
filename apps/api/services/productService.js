import prisma from "../prisma/prismaClient.js";
import createSlug from "../utils/slugify.js";

// Thêm sản phẩm
export const addProduct = async (productData) => {
    try {
        const { name, desc, categoryId, brandId, variants, images } = productData;

        const newProduct = await prisma.product.create({
            data: {
                name,
                slug: createSlug(name),
                desc,
                categoryId,
                brandId,
                variants: {
                    create: variants, // Tạo các variants cho sản phẩm
                },
                images: {
                    create: images, // Thêm ảnh cho sản phẩm
                },
            }
        });

        return newProduct;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Cập nhật sản phẩm
export const updateProduct = async (productId, productData) => {
    try {
        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: productData,
        });

        return updatedProduct;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Xóa sản phẩm
export const deleteProduct = async (productId) => {
    try {
        const deletedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                isDeleted: true,
            }
        });

        return deletedProduct;
    } catch (error) {
        throw new Error(error.message);
    }
};
