import { addToCartService, updateCartService, removeFromCartService, getCartSummaryService } from "../services/cartService.js";

export const addToCart = async (req, res) => {
  const userId = req.user.id;
  console.log("check userID: ", userId);
  const { variantId, quantity } = req.body;
  if (!variantId || !quantity) {
    return res.status(400).json({ message: "variantId và quantity là bắt buộc" });
  }

  try {
    const cartSummary = await addToCartService(userId, variantId, quantity);
    return res.json(cartSummary);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateCart = async (req, res) => {
  const userId = req.user.id;
  const { cartItemId, quantity } = req.body;

  if (!cartItemId || quantity == null) {
    return res.status(400).json({ message: "cartItemId và quantity là bắt buộc" });
  }

  try {
    const cartSummary = await updateCartService(userId, cartItemId, quantity);
    return res.json(cartSummary);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const { cartItemId } = req.body;

  if (!cartItemId) {
    return res.status(400).json({ message: "cartItemId là bắt buộc" });
  }

  try {
    const cartSummary = await removeFromCartService(userId, cartItemId);
    return res.json(cartSummary);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getCartSummary = async (req, res) => {
  const userId = req.user.id;

  try {
    const summary = await getCartSummaryService(userId);
    return res.json(summary);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
