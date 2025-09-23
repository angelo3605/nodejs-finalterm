import express from "express";
import { applyDiscount, getAllDiscountCode, getDetailDiscountCode } from "../controllers/discountCodeController.js";

const discountRoutes = express.Router();

discountRoutes.post("/apply-discount", applyDiscount);
discountRoutes.get("/get-all", getAllDiscountCode);
discountRoutes.get("/get-detail", getDetailDiscountCode);

export default discountRoutes;
