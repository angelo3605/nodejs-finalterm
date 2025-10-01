import express from "express";
import checkAdmin from "../middleware/adminMiddleware.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { createCategory, deleteCategory, getCategories, getCategoriesFromTrash, getCategoryBySlug, restoreCategory, updateCategory } from "../controllers/categoryController.js";
import { passport } from "../utils/passport.js";
import { validate } from "../middleware/zodMiddleware.js";
import { categorySchema } from "../schemas/categorySchema.js";
import { checkRole } from "../middleware/roleMiddleware.js";

const categoryRouter = express.Router();

categoryRouter.get("/", getCategories);
categoryRouter.get("/:slug", getCategoryBySlug);

categoryRouter.use(requireAuth, checkRole("ADMIN"));

categoryRouter.post("/", validate(categorySchema), createCategory);
categoryRouter.get("/trash", getCategoriesFromTrash);
categoryRouter.put("/:slug", updateCategory);
categoryRouter.delete("/:slug", deleteCategory);
categoryRouter.patch("/:slug/restore", restoreCategory);

export default categoryRouter;
