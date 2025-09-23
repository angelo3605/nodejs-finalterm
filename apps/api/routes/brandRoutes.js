import express from "express";
import { passport } from "../utils/passport.js";

import checkAdmin from "../middleware/adminMiddleware.js";
import { createBrand, deleteBrand, getBrandBySlug, getBrands, getBrandsFromTrash, restoreBrand, updateBrand } from "../controllers/brandController.js";
const brandRouter = express.Router();

brandRouter.get("/", getBrands);

brandRouter.post("/", passport.authenticate("jwt", { session: false }), checkAdmin, createBrand);
brandRouter.get("/trash", passport.authenticate("jwt", { session: false }), checkAdmin, getBrandsFromTrash);

brandRouter.get("/:slug", getBrandBySlug);
brandRouter.put("/:slug", passport.authenticate("jwt", { session: false }), checkAdmin, updateBrand);
brandRouter.delete("/:slug", passport.authenticate("jwt", { session: false }), checkAdmin, deleteBrand);
brandRouter.patch("/:slug/restore", passport.authenticate("jwt", { session: false }), checkAdmin, restoreBrand);

export default brandRouter;
