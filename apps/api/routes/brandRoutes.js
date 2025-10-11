import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { createBrand, deleteBrand, getBrandBySlug, getBrands, getBrandsFromTrash, restoreBrand, updateBrand } from "../controllers/brandController.js";
import { checkRole } from "../middleware/roleMiddleware.js";

const brandRouter = express.Router();

brandRouter.get("/", getBrands);
brandRouter.get("/:slug", getBrandBySlug);

brandRouter.post("/", requireAuth, checkRole("ADMIN"), createBrand);
brandRouter.get("/trash", requireAuth, checkRole("ADMIN"), getBrandsFromTrash);
brandRouter.put("/:slug", requireAuth, checkRole("ADMIN"), updateBrand);
brandRouter.delete("/:slug", requireAuth, checkRole("ADMIN"), deleteBrand);
brandRouter.patch("/:slug/restore", requireAuth, checkRole("ADMIN"), restoreBrand);

export default brandRouter;
