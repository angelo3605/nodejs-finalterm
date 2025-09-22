import express from 'express';
import { addToCart, updateCart, removeFromCart, getCartSummary } from "../controllers/cartController.js";
import authMiddleware from '../middleware/authMiddleware.js';

const cartRoutes = express.Router();
cartRoutes.use(authMiddleware)

cartRoutes.post('/', addToCart);
cartRoutes.put('/', updateCart);
cartRoutes.delete('/:cartItemId', removeFromCart);
cartRoutes.get('/summary', getCartSummary);

export default cartRoutes;
