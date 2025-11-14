import { addOrSubtractToCartService, getOrCreateCartService } from "../services/cartService.js";

export const getCart = async (req, res) => {
  const cart = await getOrCreateCartService({
    userId: req.user?.id,
    guestId: req.guestId,
  });
  return res.json({
    data: cart,
  });
};

export const addOrSubtractToCart = async (req, res) => {
  const cart = await addOrSubtractToCartService(
    {
      userId: req.user?.id,
      guestId: req.guestId,
    },
    req.body,
  );
  return res.json({
    data: cart,
  });
};
