import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { createCategory, deleteCategory, getCategories, getCategoriesFromTrash, getCategoryBySlug, restoreCategory, updateCategory } from "../controllers/categoryController.js";
import { validate } from "../middleware/zodMiddleware.js";
import { categorySchema } from "../schemas/categorySchema.js";
import { checkRole } from "../middleware/roleMiddleware.js";

const categoryRouter = express.Router();

categoryRouter.get("/", getCategories);
categoryRouter.get("/:slug", getCategoryBySlug);

categoryRouter.post("/", requireAuth, checkRole("ADMIN"), validate(categorySchema), createCategory);
categoryRouter.get("/trash", requireAuth, checkRole("ADMIN"), getCategoriesFromTrash);
categoryRouter.put("/:slug", requireAuth, checkRole("ADMIN"), updateCategory);
categoryRouter.delete("/:slug", requireAuth, checkRole("ADMIN"), deleteCategory);
categoryRouter.patch("/:slug/restore", requireAuth, checkRole("ADMIN"), restoreCategory);

export default categoryRouter;
