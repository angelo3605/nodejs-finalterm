import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { createMyShippingAddress, deleteMyShippingAddress, getMyShippingAddressById, getMyShippingAddresses, updateMyShippingAddress } from "../controllers/shippingAddressController.js";
import { shippingAddressSchema } from "@mint-boutique/zod-schemas";
import { validate } from "../middlewares/zodMiddleware.js";

const shippingAddressRouter = Router();

shippingAddressRouter.use(requireAuth);

shippingAddressRouter.get("/", getMyShippingAddresses);
shippingAddressRouter.get("/:id", getMyShippingAddressById);

shippingAddressRouter.post("/", validate(shippingAddressSchema), createMyShippingAddress);
shippingAddressRouter.patch("/:id", validate(shippingAddressSchema.partial()), updateMyShippingAddress);
shippingAddressRouter.delete("/:id", deleteMyShippingAddress);

export default shippingAddressRouter;
