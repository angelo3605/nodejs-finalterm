import { Router } from "express";

import { requireAuth } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/roleMiddleware.js";
import { validate } from "../middlewares/zodMiddleware.js";
import { productSchema } from "@mint-boutique/zod-schemas";
import { createProduct, deleteProduct, getAllProducts, getProductBySlug, restoreProduct, updateProduct } from "../controllers/productController.js";

const productRouter = new Router();

productRouter.get("/", getAllProducts);
productRouter.get("/:slug", getProductBySlug);

productRouter.post("/", requireAuth, checkRole("ADMIN"), validate(productSchema), createProduct);
productRouter.patch("/:slug", requireAuth, checkRole("ADMIN"), validate(productSchema.partial()), updateProduct);
productRouter.delete("/:slug", requireAuth, checkRole("ADMIN"), deleteProduct);
productRouter.post("/:slug/restore", requireAuth, checkRole("ADMIN"), restoreProduct);

export default productRouter;
