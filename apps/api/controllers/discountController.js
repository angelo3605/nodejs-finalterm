import { createDiscountCodeService, getAllDiscountCodesService, getDiscountCodeDetailsService } from "../services/discountService";

export const applyDiscount = async (req, res) => {
  const { code } = req.body;
  const discount = await getDiscountCodeDetailsService(code);
  return res.json(discount);
};

export const createDiscountCode = async (req, res) => {
  const { code, desc, type, value, usageLimit } = req.body;
  const discount = await createDiscountCodeService(code, desc, type, value, usageLimit);
  return res.json(discount);
};

export const getAllDiscountCodes = async (req, res) => {
  const discounts = await getAllDiscountCodesService();
  return res.json(discounts);
};

export const getDiscountCodeDetails = async (req, res) => {
  const { code } = req.body;
  const discount = await getDiscountCodeDetailsService(code);
  return res.json(discount);
};
