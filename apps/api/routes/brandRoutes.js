import express from "express";
import { passport } from "../utils/passport.js";

import checkAdmin from "../middleware/adminMiddleware.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { createBrand, deleteBrand, getBrandBySlug, getBrands, getBrandsFromTrash, restoreBrand, updateBrand } from "../controllers/brandController.js";
import { checkRole } from "../middleware/roleMiddleware.js";
const brandRouter = express.Router();

brandRouter.get("/", getBrands);
brandRouter.get("/:slug", getBrandBySlug);

brandRouter.use(requireAuth, checkRole("ADMIN"));

brandRouter.post("/", createBrand);
brandRouter.get("/trash", getBrandsFromTrash);
brandRouter.put("/:slug", updateBrand);
brandRouter.delete("/:slug", deleteBrand);
brandRouter.patch("/:slug/restore", restoreBrand);

export default brandRouter;
