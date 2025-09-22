import { getDashboardStats, getAdvancedDashboardStats } from "../services/dashboardService.js";
import { restoreProductService, deleteProductService, updateProductService, addProductService } from "../services/productService.js";
import { updateOrderStatus, getAllOrders } from "../services/orderService.js";
import { addVariantService, deleteVariantService, restoreVariantService, updateVariantService } from "../services/variantService.js";
import { addImageService, deleteImageService, updateImageService } from "../services/imageService.js";

export const getDashboard = async (req, res) => {
    try {
        const stats = await getDashboardStats();
        return res.json(stats);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getDashboardHigh = async (req, res) => { // nâng cao
    try {
        // Lấy thông tin khoảng thời gian từ request
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Start date and end date are required" });
        }

        // Gọi service để lấy dữ liệu thống kê
        const dashboardStats = await getAdvancedDashboardStats(startDate, endDate);

        return res.json({
            message: "Dashboard data fetched successfully",
            data: dashboardStats,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

export const createProduct = async (req, res) => {
    const productData = req.body;
    try {
        const product = await addProductService(productData);
        return res.status(201).json(product);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Cập nhật sản phẩm
export const modifyProduct = async (req, res) => {
    const { slug } = req.params;  // Lấy slug từ URL params
    const { name, desc, categoryId, brandId, variants, images } = req.body;  // Lấy dữ liệu sản phẩm từ body

    try {
        const updatedProduct = await updateProductService(slug, name, desc, categoryId, brandId, variants, images);
        return res.json(updatedProduct);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Xóa sản phẩm
export const removeProduct = async (req, res) => {
    const { slug } = req.params;
    try {
        const deletedProduct = await deleteProductService(slug);
        return res.json(deletedProduct);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Khôi phục sản phẩm
export const restoreProduct = async (req, res) => {
    const { slug } = req.params;
    console.log(slug);
    try {
        const restoredProduct = await restoreProductService(slug);
        return res.json(restoredProduct);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// Thêm một variant mới
export const addVariant = async (req, res) => {
    const { name, price, stockQuantity, productId } = req.body;  

    try {
        const newVariant = await addVariantService(name, price, stockQuantity, productId);
        res.status(201).json(newVariant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Cập nhật thông tin một variant
export const updateVariant = async (req, res) => {
    try {
        const { variantId } = req.params;
        const { name, price, stockQuantity } = req.body;
        const updatedVariant = await updateVariantService(variantId, name, price, stockQuantity );
        return res.status(200).json({ message: "Variant updated successfully", variant: updatedVariant });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Xóa một variant (soft delete)
export const deleteVariant = async (req, res) => {
    try {
        const { variantId } = req.params;
        const deletedVariant = await deleteVariantService(variantId);
        return res.status(200).json({ message: "Variant deleted successfully", variant: deletedVariant });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Khôi phục một variant đã xóa
export const restoreVariant = async (req, res) => {
    try {
        const { variantId } = req.params;
        const restoredVariant = await restoreVariantService(variantId);
        return res.status(200).json({ message: "Variant restored successfully", variant: restoredVariant });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// Thêm một image mới
export const addImage = async (req, res) => {
    try {
        const { url, filePath, altText, productId } = req.body;
        const newImage = await addImageService({ url, filePath, altText, productId });
        return res.status(201).json({ message: "Image added successfully", image: newImage });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Cập nhật thông tin một image
export const updateImage = async (req, res) => {
    try {
        const { imageId } = req.params;
        const { url, filePath, altText } = req.body;
        const updatedImage = await updateImageService(imageId, url, filePath, altText );
        return res.status(200).json({ message: "Image updated successfully", image: updatedImage });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Xóa một image
export const deleteImage = async (req, res) => {
    try {
        const { imageId } = req.params;
        const deletedImage = await deleteImageService(imageId);
        return res.status(200).json({ message: "Image deleted successfully", image: deletedImage });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



// Lấy tất cả người dùng
export const listUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        return res.json(users);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Cấm người dùng
export const disableUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await blockUser(userId);
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Cập nhật thông tin người dùng
export const editUser = async (req, res) => {
    const { userId } = req.params;
    const userData = req.body;
    try {
        const updatedUser = await updateUser(userId, userData);
        return res.json(updatedUser);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Cập nhật trạng thái đơn hàng
export const modifyOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
        const updatedOrder = await updateOrderStatus(orderId, status);
        return res.json(updatedOrder);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Lấy tất cả đơn hàng
export const listOrders = async (req, res) => {
    try {
        const orders = await getAllOrders();
        return res.json(orders);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};