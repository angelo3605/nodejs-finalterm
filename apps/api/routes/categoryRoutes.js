import { Router } from "express";

import { requireAuth } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/roleMiddleware.js";
import { validate } from "../middlewares/zodMiddleware.js";
import { categorySchema } from "@mint-boutique/zod-schemas";
import { createCategory, deleteCategory, getAllCategories, getCategoryBySlug, restoreCategory, updateCategory } from "../controllers/categoryController.js";

const categoryRouter = new Router();

categoryRouter.get("/", getAllCategories);
categoryRouter.get("/:slug", getCategoryBySlug);

categoryRouter.post("/", requireAuth, checkRole("ADMIN"), validate(categorySchema), createCategory);
categoryRouter.patch("/:slug", requireAuth, checkRole("ADMIN"), validate(categorySchema.partial()), updateCategory);
categoryRouter.delete("/:slug", requireAuth, checkRole("ADMIN"), deleteCategory);
categoryRouter.post("/:slug/restore", requireAuth, checkRole("ADMIN"), restoreCategory);

export default categoryRouter;
