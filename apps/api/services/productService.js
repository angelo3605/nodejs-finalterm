import prisma from "../prisma/prismaClient.js";
import createSlug from "../utils/slugify.js";

// Thêm sản phẩm
export const addProductService = async (productData) => {
    try {
        const { name, desc, categoryId, brandId, variants, images } = productData;

        const newProduct = await prisma.product.create({
            data: {
                name,
                slug: createSlug(name),
                desc,
                categoryId,
                brandId,
                variants: variants.length ? { create: variants } : undefined,  // Tạo variants nếu có
                images: images.length ? { create: images } : undefined, 
            }
        });

        return newProduct;
    } catch (error) {
        throw new Error(error.message);
    }
};

// nếu được làm get from trash

export const updateProductService = async (slug, name, desc, categoryId, brandId, variants, images) => {
    const updatedSlug = createSlug(name);

    try {
        const updatedProduct = await prisma.product.update({
            where: { slug },
            data: {
                slug: updatedSlug,
                name,
                desc,
                category: categoryId ? { connect: { id: categoryId } } : undefined,  // Nếu có categoryId, connect với category
                brand: brandId ? { connect: { id: brandId } } : undefined,  // Nếu có brandId, connect với brand
                variants: variants && variants.length ? {
                    update: variants.map(variant => ({
                        where: { id: variant.id },
                        data: {
                            name: variant.name,
                            price: variant.price,
                            stockQuantity: variant.stockQuantity
                        }
                    }))
                } : undefined,
                images: images && images.length ? {
                    update: images.map(image => ({
                        where: { id: image.id },
                        data: {
                            url: image.url,
                            filePath: image.filePath,
                            altText: image.altText
                        }
                    }))
                } : undefined,
            }
        });

        return updatedProduct;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Xóa sản phẩm
export const deleteProductService = async (slug) => {
    try {
        const deletedProduct = await prisma.product.update({
            where: { slug },
            data: {
                isDeleted: true,
            }
        });

        return deletedProduct;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const restoreProductService = async (slug) => {
    try {
        const deletedProduct = await prisma.product.update({
            where: { slug },
            data: {
                isDeleted: false,
            }
        });

        return deletedProduct;
    } catch (error) {
        throw new Error(error.message);
    }
};
