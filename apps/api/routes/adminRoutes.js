import express from 'express';
import { addImage, addVariant, deleteImage, deleteVariant, getDashboard, getDashboardHigh, restoreProduct, restoreVariant, updateImage, updateVariant } from "../controllers/adminController.js";
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
router.put('/product/:slug', modifyProduct);  // Cập nhật sản phẩm
router.delete('/product/:slug', removeProduct);  // Xóa sản phẩm
router.patch('/product/:slug', restoreProduct);  // Khôi phục sản phẩm

router.post('/variant', addVariant);  // Thêm sản phẩm
router.put('/variant/:variantId', updateVariant);  // Cập nhật sản phẩm
router.delete('/variant/:variantId', deleteVariant);  // Xóa sản phẩm
router.patch('/variant/:variantId', restoreVariant);  // Khôi phục sản phẩm

router.post('/image', addImage);  // Thêm sản phẩm
router.put('/image/:imageId', updateImage);  // Cập nhật sản phẩm
router.delete('/image/:imageId', deleteImage);  // Xóa sản phẩm

router.get('/users', listUsers);  // Lấy danh sách người dùng
router.put('/user/disable/:userId', disableUser);  // Cấm người dùng
router.put('/user/:userId', editUser);
router.get('/orders', listOrders);  // Lấy danh sách đơn hàng
router.put('/order/:orderId', modifyOrderStatus);

export default router;
