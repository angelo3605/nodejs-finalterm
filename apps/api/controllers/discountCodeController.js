import { tr } from "zod/v4/locales";
import { createDiscountCodeService, getAllDiscountCodeService, getDetailDiscountCodeService, getDiscountDetailsService } from "../services/discountCodeService.js";

export const applyDiscount = async (req, res) => {
  const { code } = req.body;
  try {
    const discount = await getDiscountDetailsService(code);
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

export const getAllDiscountCode = async (req, res) => {
  try {
    const discounts = await getAllDiscountCodeService();
    return res.json(discounts);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getDetailDiscountCode = async (req, res) => {
  try {
    const {code} = req.body;
    const discount = await getDetailDiscountCodeService(code);
    return res.json(discount);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
