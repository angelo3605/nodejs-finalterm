import { getDashboardStats, getAdvancedDashboardStats } from "../services/dashboardService.js";
import { addProduct, updateProduct, deleteProduct } from "../services/productService.js";
import { updateOrderStatus, getAllOrders } from "../services/orderService.js";

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
        const product = await addProduct(productData);
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
        const updatedProduct = await updateProduct(slug, name, desc, categoryId, brandId, variants, images);
        return res.json(updatedProduct);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Xóa sản phẩm
export const removeProduct = async (req, res) => {
    const { slug } = req.params;
    try {
        const deletedProduct = await deleteProduct(slug);
        return res.json(deletedProduct);
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