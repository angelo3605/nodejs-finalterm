import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { applyDiscount, getAllDiscountCodes, getDiscountCodeDetails } from "../controllers/discountController.js";

const discountRouter = Router();

discountRouter.get("/", getAllDiscountCodes);

discountRouter.get("/:code", getDiscountCodeDetails );

discountRouter.post("/apply", requireAuth, applyDiscount);

export default discountRouter;
