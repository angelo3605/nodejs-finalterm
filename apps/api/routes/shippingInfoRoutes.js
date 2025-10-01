import express from "express";
import { validate } from "../middleware/zodMiddleware.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { ShippingInfoSchema } from "../schemas/shippingInfoSchema.js";
import { changeIsDefault, createShippingAddress, deleteShippingInfo, getAllShippingInfo } from "../controllers/shippingInfoController.js";

const shippingInfoRouter = express.Router();
shippingInfoRouter.use(requireAuth);

shippingInfoRouter.get("/", getAllShippingInfo);
shippingInfoRouter.post("/", validate(ShippingInfoSchema), createShippingAddress);
shippingInfoRouter.post("/change-default", changeIsDefault);
shippingInfoRouter.delete("/", deleteShippingInfo);

export default shippingInfoRouter;
