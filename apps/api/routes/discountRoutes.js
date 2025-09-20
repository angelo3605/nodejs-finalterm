import express from 'express';
import { applyDiscount } from "../controllers/discountController.js";

const orderRoutes = express.Router();

orderRoutes.post('/apply-discount', applyDiscount);

export default orderRoutes;
