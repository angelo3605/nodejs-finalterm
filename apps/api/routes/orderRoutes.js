import express from "express";
import { checkout } from "../controllers/orderController.js";
import { passport } from "../utils/passport.js";
import { optionalAuthenticate } from "../middleware/middleware.js";

const orderRoutes = express.Router();

orderRoutes.post("/checkout", optionalAuthenticate, checkout);

export default orderRoutes;
