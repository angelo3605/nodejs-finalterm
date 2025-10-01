import express from "express";
import { changePassword, sendPasswordReset, updateFullName } from "../controllers/userController.js";
import { passport } from "../utils/passport.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { getDetailOrder } from "../controllers/adminController.js";

const userRoutes = express.Router();
userRoutes.use(requireAuth);

userRoutes.post("/change", updateFullName);
userRoutes.post("/password", changePassword);
userRoutes.post("/reset", sendPasswordReset);
userRoutes.get("/order/:orderId", getDetailOrder);

export default userRoutes;
