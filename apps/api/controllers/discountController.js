import { createDiscountCodeService, getAllDiscountCodesService, getDiscountCodeDetailsService } from "../services/discountService";

export const applyDiscount = async (req, res) => {
  const { code } = req.body;
  try {
    const discount = await getDiscountCodeDetailsService(code);
    return res.json(discount);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const createDiscountCode = async (req, res) => {
  const { code, desc, type, value, usageLimit } = req.body;
  try {
    const discount = await createDiscountCodeService(code, desc, type, value, usageLimit);
    return res.json(discount);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getAllDiscountCodes = async (req, res) => {
  try {
    const discounts = await getAllDiscountCodesService();
    return res.json(discounts);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getDiscountCodeDetails = async (req, res) => {
  const { code } = req.body;
  try {
    const discount = await getDiscountCodeDetailsService(code);
    return res.json(discount);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
