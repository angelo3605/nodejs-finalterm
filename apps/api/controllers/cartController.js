import { addToCartService, updateCartService, removeFromCartService, getCartSummaryService } from "../services/cartService.js";

export const addToCart = async (req, res) => {
    const { userId, productId, variantId, quantity } = req.body;
    try {
        const cartSummary = await addToCartService(userId, productId, variantId, quantity);
        return res.json(cartSummary);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const updateCart = async (req, res) => {
    const { userId, cartItemId, quantity } = req.body;
    try {
        const cartSummary = await updateCartService(userId, cartItemId, quantity);
        return res.json(cartSummary);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const removeFromCart = async (req, res) => {
    const { userId, cartItemId } = req.body;
    try {
        const cartSummary = await removeFromCartService(userId, cartItemId);
        return res.json(cartSummary);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

export const getCartSummary = async (req, res) => {
    const { userId } = req.params;
    try {
        const summary = await getCartSummaryService(userId);
        return res.json(summary);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
