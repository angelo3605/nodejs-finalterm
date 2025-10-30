import { Router } from "express";
import { createDiscountCode, deleteDiscountCode, getAllDiscountCodes, getDiscountCodeByCode, restoreDiscountCode, updateDiscountCode } from "../controllers/discountCodeController.js";
import { discountCodeSchema } from "@mint-boutique/zod-schemas";
import { validate } from "../middlewares/zodMiddleware.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/roleMiddleware.js";

const discountCodeRouter = new Router();

discountCodeRouter.get("/", getAllDiscountCodes);
discountCodeRouter.get("/:code", getDiscountCodeByCode);

discountCodeRouter.post("/", requireAuth, checkRole("ADMIN"), validate(discountCodeSchema), createDiscountCode);
discountCodeRouter.patch("/:code", requireAuth, checkRole("ADMIN"), validate(discountCodeSchema.partial()), updateDiscountCode);
discountCodeRouter.delete("/:code", requireAuth, checkRole("ADMIN"), deleteDiscountCode);
discountCodeRouter.post("/:code/restore", requireAuth, checkRole("ADMIN"), restoreDiscountCode);

export default discountCodeRouter;
