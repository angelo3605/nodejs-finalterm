import { getDiscountDetailsService } from "../services/discountService.js";

export const applyDiscount = async (req, res) => {
    const { code } = req.body;
    try {
        const discount = await getDiscountDetailsService(code);
        return res.json(discount);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
