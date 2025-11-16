import { Router } from "express";
import { createGhnOrder, getShipmentDetails, getShippingFee, getWard } from "../controllers/ghnController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/roleMiddleware.js";
import { ghnSchema } from "@mint-boutique/zod-schemas";
import { validate } from "../middlewares/zodMiddleware.js";

const ghnRouter = Router();

ghnRouter.get("/ward", getWard);
ghnRouter.get("/fee", getShippingFee);
ghnRouter.get("/details", requireAuth, getShipmentDetails);
ghnRouter.post("/create", requireAuth, checkRole("ADMIN"), validate(ghnSchema), createGhnOrder);

export default ghnRouter;
