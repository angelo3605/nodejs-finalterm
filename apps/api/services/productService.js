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
export const updateProduct = async (slug, name, desc, categoryId, brandId, variants, images) => {
    const updatedSlug = createSlug(name);  // Tạo slug mới từ tên sản phẩm

    try {
        // Cập nhật sản phẩm trong database
        const updatedProduct = await prisma.product.update({
            where: { slug },  // Điều kiện tìm sản phẩm theo slug
            data: {
                slug: updatedSlug,  // Cập nhật slug
                name,               // Cập nhật tên sản phẩm
                desc,               // Cập nhật mô tả sản phẩm
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
                } : undefined,  // Cập nhật variants nếu có
                images: images && images.length ? {
                    update: images.map(image => ({
                        where: { id: image.id },
                        data: {
                            url: image.url,
                            filePath: image.filePath,
                            altText: image.altText
                        }
                    }))
                } : undefined, // Cập nhật images nếu có
            }
        });

        return updatedProduct;  // Trả về sản phẩm đã được cập nhật
    } catch (error) {
        // Nếu có lỗi, ném lỗi ra ngoài
        throw new Error(error.message);
    }
};

// Xóa sản phẩm
export const deleteProduct = async (slug) => {
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
