import prisma from "../prisma/prismaClient.js";

export const addImageService = async (imageData) => {
    try {
        const { url, filePath, altText, productId } = imageData;  // Nhận các tham số ảnh và ID sản phẩm

        const newImage = await prisma.image.create({
            data: {
                url,        // Đường dẫn ảnh
                filePath,   // Đường dẫn file trên server
                altText,    // Mô tả ảnh
                product: {  // Liên kết ảnh với sản phẩm
                    connect: { id: productId }
                },
            }
        });

        return newImage;  // Trả về ảnh đã tạo
    } catch (error) {
        throw new Error(error.message);
    }
};

// {   dữ liệu mẫu để test create trường hợp bị sai
//   "url": "https://example.com/image1.jpg",
//   "filePath": "/images/product1/image1.jpg",
//   "altText": "Image 1 for Product 1",
//   "productId": "68d0de2803b7b37ad03cfd6e"
// }
// { 
//   "url": "https://example.com/images/tshirt1.jpg",
//   "filePath": "/images/tshirt1.jpg",
//   "altText": "Áo thun màu đỏ",
//   "productId": "68d0de2803b7b37ad03cfd6e"
// }


export const updateImageService = async (imageId, url, filePath, altText) => {
    try {
        const updatedImage = await prisma.image.update({
            where: { id: imageId },
            data: {
                url,
                filePath,
                altText,
            },
        });

        return updatedImage;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const deleteImageService = async (imageId) => {
    try {
        const deletedImage = await prisma.image.delete({
            where: { id: imageId },
        });

        return deletedImage;
    } catch (error) {
        throw new Error(error.message);
    }
};


export const getImagesByProductService = async (productId) => {
    try {
        const images = await prisma.image.findMany({
            where: { productId },
        });

        return images;
    } catch (error) {
        throw new Error(error.message);
    }
};