import express from "express";
import { addImage, addVariant, changeRoleUser, deleteImage, deleteVariant, getDashboard, getDashboardHigh, getDetailOrder, restoreProduct, restoreVariant, updateImage, updateVariant } from "../controllers/adminController.js";
import { createProduct, modifyProduct, removeProduct } from "../controllers/adminController.js";
import { modifyOrderStatus, listOrders } from "../controllers/adminController.js";
import { listUsers, editUser } from "../controllers/adminController.js";
import { createDiscountCode } from "../controllers/discountCodeController.js";
import { validate } from "../middleware/zodMiddleware.js";
import { discountCodeSchema } from "../schemas/discountCodeSchema.js";

const router = express.Router();

router.get("/dashboard", getDashboard);
router.get("/high-dashboard", getDashboardHigh);

router.post("/product", createProduct); // Thêm sản phẩm
router.put("/product/:slug", modifyProduct); // Cập nhật sản phẩm
router.delete("/product/:slug", removeProduct); // Xóa sản phẩm
router.patch("/product/:slug", restoreProduct); // Khôi phục sản phẩm

router.post("/variant", addVariant); // Thêm sản phẩm
router.put("/variant/:variantId", updateVariant); // Cập nhật sản phẩm
router.delete("/variant/:variantId", deleteVariant); // Xóa sản phẩm
router.patch("/variant/:variantId", restoreVariant); // Khôi phục sản phẩm

router.post("/image", addImage); // Thêm sản phẩm
router.put("/image/:imageId", updateImage); // Cập nhật sản phẩm
router.delete("/image/:imageId", deleteImage); // Xóa sản phẩm

router.post("/discount", validate(discountCodeSchema), createDiscountCode); // Thêm sản phẩm

router.get("/users", listUsers); // Lấy danh sách người dùng
router.put("/user/changerole/:userId", changeRoleUser); // Cấm người dùng
router.put("/user/:userId", editUser);
router.get("/orders", listOrders); // Lấy danh sách đơn hàng
router.get("/order/:orderId", getDetailOrder);
router.put("/order/:orderId", modifyOrderStatus);

export default router;
