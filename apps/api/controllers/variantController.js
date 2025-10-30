import { createVariantService, getAllVariantsService, getVariantByIdService, updateVariantService } from "../services/variantService.js";

export const getAllVariants = async (req, res) => {
  const variants = await getAllVariantsService({}, req.pagination);
  return res.json({
    data: variants,
  });
};

export const getVariantById = async (req, res) => {
  const variant = await getVariantByIdService(req.params.id);
  return res.json({
    data: variant,
  });
};

export const createVariant = async (req, res) => {
  const variant = await createVariantService(req.body);
  return res.json({
    data: variant,
  });
};

export const updateVariant = async (req, res) => {
  const variant = await updateVariantService(req.params.id, req.body);
  return res.json({
    data: variant,
  });
};

export const deleteVariant = async (req, res) => {
  const variant = await updateVariantService(req.params.id, {
    isDeleted: true,
  });
  return res.json({
    data: variant,
  });
};

export const restoreVariant = async (req, res) => {
  const variant = await updateVariantService(req.params.id, {
    isDeleted: false,
  });
  return res.json({ variant });
};
