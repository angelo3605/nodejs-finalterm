import express from "express";
import { getAllProduct, getTopProduct } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/", getAllProduct);
productRouter.get("/top", getTopProduct);

export default productRouter;
