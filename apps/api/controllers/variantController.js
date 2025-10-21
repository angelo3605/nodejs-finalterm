import { createVariantService, getAllVariantsService, getVariantByIdService, updateVariantService } from "../services/variantService.js";

export const getAllVariants = async (req, res) => {
  const variants = await getAllVariantsService();
  return res.json({ variants });
};

export const getVariantById = async (req, res) => {
  const variant = await getVariantByIdService(req.params.id);
  return res.json({ variant });
};

export const createVariant = async (req, res) => {
  const { productSlug, ...data } = req.body;
  const variant = await createVariantService(productSlug, data);
  return res.json({ variant });
};

export const updateVariant = async (req, res) => {
  const { isDeleted, ...data } = req.body;
  const variant = await updateVariantService(req.params.id, data);
  return res.json({ variant });
};

export const deleteVariant = async (req, res) => {
  const variant = await updateVariantService(req.params.id, { isDeleted: true });
  return res.json({ variant });
};

export const restoreVariant = async (req, res) => {
  const variant = await updateVariantService(req.params.id, { isDeleted: false });
  return res.json({ variant });
};
