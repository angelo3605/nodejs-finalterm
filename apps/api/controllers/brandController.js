import { createBrandService, getAllBrandsService, getBrandBySlugService, updateBrandService } from "../services/brandService.js";

export const getAllBrands = async (req, res) => {
  const brands = await getAllBrandsService();
  return res.json({ brands });
};

export const getBrandBySlug = async (req, res) => {
  const brand = await getBrandBySlugService(req.params.slug);
  return res.json({ brand });
};

export const createBrand = async (req, res) => {
  const brand = await createBrandService(req.body.name);
  return res.json({ brand });
};

export const updateBrand = async (req, res) => {
  const { isDeleted, ...data } = req.body;
  const brand = await updateBrandService(req.params.slug, data);
  return res.json({ brand });
};

export const deleteBrand = async (req, res) => {
  const brand = await updateBrandService(req.params.slug, { isDeleted: true });
  return res.json({ brand });
};

export const restoreBrand = async (req, res) => {
  const brand = await updateBrandService(req.params.slug, { isDeleted: false });
  return res.json({ brand });
};
