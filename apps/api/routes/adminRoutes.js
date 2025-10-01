import { Router } from "express";
import {
  addImage,
  addVariant,
  changeRoleUser,
  deleteImage,
  deleteVariant,
  getDashboard,
  getDashboardHigh,
  getDetailOrder,
  restoreProduct,
  restoreVariant,
  updateImage,
  updateVariant,
} from "../controllers/adminController.js";
import { createProduct, modifyProduct, removeProduct } from "../controllers/adminController.js";
import { modifyOrderStatus, listOrders } from "../controllers/adminController.js";
import { listUsers, editUser } from "../controllers/adminController.js";
import { createDiscountCode } from "../controllers/discountCodeController.js";
import { validate } from "../middleware/zodMiddleware.js";
import { discountCodeSchema } from "../schemas/discountCodeSchema.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";

const adminRouter = Router();
adminRouter.use(requireAuth, checkRole("ADMIN"));

adminRouter.get("/dashboard", getDashboard);
// lowStockVariants là count variant có stock ít hơn 5
adminRouter.get("/high-dashboard", getDashboardHigh);
// high-dashboard?startDate=2025-07-01&endDate=2025-10-01

adminRouter.post("/product", createProduct); // Thêm sản phẩm
adminRouter.put("/product/:slug", modifyProduct); // Cập nhật sản phẩm
adminRouter.delete("/product/:slug", removeProduct); // Xóa sản phẩm
adminRouter.patch("/product/:slug", restoreProduct); // Khôi phục sản phẩm

adminRouter.post("/variant", addVariant); // Thêm sản phẩm
adminRouter.put("/variant/:variantId", updateVariant); // Cập nhật sản phẩm
adminRouter.delete("/variant/:variantId", deleteVariant); // Xóa sản phẩm
adminRouter.patch("/variant/:variantId", restoreVariant); // Khôi phục sản phẩm

adminRouter.post("/image", addImage); // Thêm sản phẩm
adminRouter.put("/image/:imageId", updateImage); // Cập nhật sản phẩm
adminRouter.delete("/image/:imageId", deleteImage); // Xóa sản phẩm

adminRouter.post("/discount", validate(discountCodeSchema), createDiscountCode); // Thêm sản phẩm

adminRouter.get("/users", listUsers); // Lấy danh sách người dùng
adminRouter.put("/user/changerole/:userId", changeRoleUser); // Cấm người dùng
adminRouter.put("/user/:userId", editUser);
adminRouter.get("/orders", listOrders); // Lấy danh sách đơn hàng
adminRouter.get("/order/:orderId", getDetailOrder);
adminRouter.put("/order/:orderId", modifyOrderStatus);

export default adminRouter;
