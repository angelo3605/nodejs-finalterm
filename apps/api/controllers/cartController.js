import { addOrSubtractToCartService, getOrCreateCartService } from "../services/cartService.js";

export const addOrSubtractToCart = async (req, res) => {
  const { variantId, amount, forceDelete } = req.body;
  const cart = await addOrSubtractToCartService({
    userId: req.user?.id,
    guestId: req.guestId,
    variantId,
    amount,
    forceDelete,
  });
  return res.json({ cart });
};

export const getCart = async (req, res) => {
  const cart = await getOrCreateCartService({
    userId: req.user?.id,
    guestId: req.guestId,
  });
  return res.json({ cart });
};
