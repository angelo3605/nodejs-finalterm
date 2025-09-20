import express from 'express';
import { checkout, checkoutGuest } from "../controllers/orderController.js";

const orderRoutes = express.Router();

orderRoutes.post('/checkout', checkout);
orderRoutes.post('/checkout-guest', checkoutGuest);

export default orderRoutes;
