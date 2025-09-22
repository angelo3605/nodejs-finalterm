import { addImageService, updateImageService, deleteImageService, restoreImageService, getImagesByProductService } from ('../services/imageService.js');

// Lấy tất cả images của một sản phẩm
export const getImagesByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const images = await getImagesByProductService(productId);
        return res.status(200).json({ images });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
