import { createBrandService, getAllBrandsService, getBrandBySlugService, updateBrandService } from "../services/brandService.js";

export const getAllBrands = async (req, res) => {
  const brands = await getAllBrandsService();
  return res.json({
    data: brands,
  });
};

export const getBrandBySlug = async (req, res) => {
  const brand = await getBrandBySlugService(req.params.slug);
  return res.json({
    data: brand,
  });
};

export const createBrand = async (req, res) => {
  const brand = await createBrandService(req.body);
  return res.json({
    data: brand,
  });
};

export const updateBrand = async (req, res) => {
  const brand = await updateBrandService(req.params.slug, req.body);
  return res.json({
    data: brand,
  });
};

export const deleteBrand = async (req, res) => {
  const brand = await updateBrandService(req.params.slug, {
    isDeleted: true,
  });
  return res.json({
    data: brand,
  });
};

export const restoreBrand = async (req, res) => {
  const brand = await updateBrandService(req.params.slug, {
    isDeleted: false,
  });
  return res.json({
    data: brand,
  });
};
