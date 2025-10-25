import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { createMyShippingAddress, deleteMyShippingAddress, getMyShippingAddressById, getMyShippingAddresses, updateMyShippingAddress } from "../controllers/shippingAddressController.js";

const shippingAddressRouter = Router();

shippingAddressRouter.use(requireAuth);

shippingAddressRouter.get("/", getMyShippingAddresses);
shippingAddressRouter.get("/:id", getMyShippingAddressById);

shippingAddressRouter.post("/", createMyShippingAddress);
shippingAddressRouter.patch("/:id", updateMyShippingAddress);
shippingAddressRouter.delete("/:id", deleteMyShippingAddress);

export default shippingAddressRouter;
