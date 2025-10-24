import { Router } from "express";
import { validate } from "../middlewares/zodMiddleware.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { ShippingInfoSchema } from "../schemas/shippingInfoSchema.js";
import { changeIsDefault, createShippingAddress, deleteShippingInfo, getAllShippingInfo } from "../controllers/shippingInfoController.js";

const shippingInfoRouter = Router();

shippingInfoRouter.use(requireAuth);

shippingInfoRouter.get("/", getAllShippingInfo);

shippingInfoRouter.post("/", validate(ShippingInfoSchema), createShippingAddress);

shippingInfoRouter.patch("/default", changeIsDefault);

shippingInfoRouter.delete("/:id", deleteShippingInfo);

export default shippingInfoRouter;
