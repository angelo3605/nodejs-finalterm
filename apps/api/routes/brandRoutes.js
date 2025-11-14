import { Router } from "express";

import { requireAuth } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/roleMiddleware.js";
import { validate } from "../middlewares/zodMiddleware.js";
import { brandSchema } from "@mint-boutique/zod-schemas";
import { createBrand, deleteBrand, getAllBrands, getBrandBySlug, restoreBrand, updateBrand } from "../controllers/brandController.js";

const brandRouter = new Router();

brandRouter.get("/", getAllBrands);
brandRouter.get("/:slug", getBrandBySlug);

brandRouter.post("/", requireAuth, checkRole("ADMIN"), validate(brandSchema), createBrand);
brandRouter.patch("/:slug", requireAuth, checkRole("ADMIN"), validate(brandSchema.partial()), updateBrand);
brandRouter.delete("/:slug", requireAuth, checkRole("ADMIN"), deleteBrand);
brandRouter.post("/:slug/restore", requireAuth, checkRole("ADMIN"), restoreBrand);

export default brandRouter;
