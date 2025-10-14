import { createCategoryService, getAllCategoriesService, getCategoryBySlugService, updateCategoryService } from "../services/categoryService.js";

export const getAllCategories = async (req, res) => {
  const categories = await getAllCategoriesService();
  return res.json({ categories });
};

export const getCategoryBySlug = async (req, res) => {
  const category = await getCategoryBySlugService(req.params.slug);
  return res.json({ category });
};

export const createCategory = async (req, res) => {
  const category = await createCategoryService(req.body);
  return res.json({ category });
};

export const updateCategory = async (req, res) => {
  const { isDeleted, ...data } = req.body;
  const category = await updateCategoryService(req.params.slug, data);
  return res.json({ category });
};

export const deleteCategory = async (req, res) => {
  const category = await updateCategoryService(req.params.slug, { isDeleted: true });
  return res.json({ category });
};

export const restoreCategory = async (req, res) => {
  const category = await updateCategoryService(req.params.slug, { isDeleted: false });
  return res.json({ category });
};
