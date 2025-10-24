import { addToCartService, updateCartService, removeItemFromCartService, getCartSummaryService } from "../services/cartService.js";

export const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { cartItemId, quantity } = req.body;

  const cartSummary = await addToCartService(userId, cartItemId, quantity);
  return res.json({ cartSummary });
};

export const updateCart = async (req, res) => {
  const userId = req.user.id;
  const { cartItemId, quantity } = req.body;

  const cartSummary = await updateCartService(userId, cartItemId, quantity);
  return res.json({ cartSummary });
};

export const removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const { cartItemId } = req.body;

  const cartSummary = await removeItemFromCartService(userId, cartItemId);
  return res.json({ cartSummary });
};

export const getCartSummary = async (req, res) => {
  const userId = req.user.id;

  const summary = await getCartSummaryService(userId);
  return res.json({ summary });
};
