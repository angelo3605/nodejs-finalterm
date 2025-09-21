import express from 'express';
import { getDashboard, getDashboardHigh } from "../controllers/adminController.js";
import { createProduct, modifyProduct, removeProduct } from "../controllers/adminController.js";
import { modifyOrderStatus, listOrders } from "../controllers/adminController.js";
import { listUsers, disableUser, editUser } from "../controllers/adminController.js";
import checkAdmin from '../middleware/adminMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware)
router.use(checkAdmin);

router.get('/dashboard', getDashboard);
router.get('/high-dashboard', getDashboardHigh);
router.post('/product', createProduct);  // Thêm sản phẩm
router.put('/product/:productId', modifyProduct);  // Cập nhật sản phẩm
router.delete('/product/:productId', removeProduct);  // Xóa sản phẩm
router.get('/users', listUsers);  // Lấy danh sách người dùng
router.put('/user/disable/:userId', disableUser);  // Cấm người dùng
router.put('/user/:userId', editUser);
router.get('/orders', listOrders);  // Lấy danh sách đơn hàng
router.put('/order/:orderId', modifyOrderStatus);

export default router;
