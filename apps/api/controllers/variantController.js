import { addVariantService, updateVariantService, deleteVariantService, restoreVariantService, getVariantsByProductService } from ('../services/variantService.js');


// Lấy tất cả variants của một sản phẩm
export const getVariantsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const variants = await getVariantsByProductService(productId);
        return res.status(200).json({ variants });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
