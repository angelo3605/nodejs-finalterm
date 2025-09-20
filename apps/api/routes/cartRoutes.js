import express from 'express';
import { addToCart, updateCart, removeFromCart, getCartSummary } from "../controllers/cartController.js";

const cartRoutes = express.Router();

cartRoutes.post('/add-to-cart', addToCart);
cartRoutes.put('/update-cart', updateCart);
cartRoutes.delete('/remove-from-cart', removeFromCart);
cartRoutes.get('/summary/:userId', getCartSummary);

export default cartRoutes;
