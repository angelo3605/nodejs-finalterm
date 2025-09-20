import { checkoutService, checkoutGuestService } from "../services/orderService.js";

// Thanh toán cho khách hàng đã đăng ký
export const checkout = async (req, res) => {
    const { userId, shippingInfo, discountCode } = req.body;
    try {
        const order = await checkoutService(userId, shippingInfo, discountCode);
        return res.status(201).json(order);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Thanh toán cho khách vãng lai
export const checkoutGuest = async (req, res) => {
    const { shippingInfo, discountCode } = req.body;
    try {
        const order = await checkoutGuestService(shippingInfo, discountCode);
        return res.status(201).json(order);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};