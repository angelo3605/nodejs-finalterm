import { Router } from "express";

import { requireAuth } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/roleMiddleware.js";
import { validate } from "../middlewares/zodMiddleware.js";
import { variantSchema } from "@mint-boutique/zod-schemas";
import { createVariant, deleteVariant, getAllVariants, getVariantById, restoreVariant, updateVariant } from "../controllers/variantController.js";

const variantRouter = new Router();

variantRouter.get("/", getAllVariants);
variantRouter.get("/:id", getVariantById);

variantRouter.post("/", requireAuth, checkRole("ADMIN"), validate(variantSchema), createVariant);
variantRouter.patch("/:id", requireAuth, checkRole("ADMIN"), validate(variantSchema.partial()), updateVariant);
variantRouter.delete("/:id", requireAuth, checkRole("ADMIN"), deleteVariant);
variantRouter.post("/:id/restore", requireAuth, checkRole("ADMIN"), restoreVariant);

export default variantRouter;
