import { createDiscountCodeService, getAllDiscountCodesService, getDiscountCodeByCodeService, updateDiscountCodeService } from "../services/discountCodeService.js";

export const getAllDiscountCodes = async (req, res) => {
  const data = await getAllDiscountCodesService(req.pagination);
  return res.json(data);
};

export const getDiscountCodeByCode = async (req, res) => {
  const discountCode = await getDiscountCodeByCodeService(req.params.code);
  return res.json({
    data: discountCode,
  });
};

export const createDiscountCode = async (req, res) => {
  const discountCode = await createDiscountCodeService(req.body);
  return res.json({
    data: discountCode,
  });
};

export const updateDiscountCode = async (req, res) => {
  const discountCode = await updateDiscountCodeService(req.params.code, req.body);
  return res.json({
    data: discountCode,
  });
};

export const deleteDiscountCode = async (req, res) => {
  const discountCode = await updateDiscountCodeService(req.params.code, {
    isDeleted: true,
  });
  return res.json({
    data: discountCode,
  });
};

export const restoreDiscountCode = async (req, res) => {
  const discountCode = await updateDiscountCodeService(req.params.code, {
    isDeleted: false,
  });
  return res.json({
    data: discountCode,
  });
};
