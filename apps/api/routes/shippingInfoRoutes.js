import express from "express";
import { changeIsDefault, createShippingAddress, deleteShippingInfo, getAllShippingInfo } from "../controllers/shippingInfoController.js";
import { passport } from "../utils/passport.js";
import { validate } from "../middleware/zodMiddleware.js";
import { ShippingInfoSchema } from "../schemas/shippingInfoSchema.js";

const shippingInfoRouter = express.Router();
shippingInfoRouter.use(passport.authenticate("jwt", { session: false }));

shippingInfoRouter.get("/", getAllShippingInfo);
shippingInfoRouter.post("/", validate(ShippingInfoSchema), createShippingAddress);
shippingInfoRouter.post("/change-default", changeIsDefault);
shippingInfoRouter.delete("/", deleteShippingInfo);

export default shippingInfoRouter;
